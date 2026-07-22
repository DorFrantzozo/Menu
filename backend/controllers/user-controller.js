import User from "../model/user.js";
import Category from "../model/category.js";
import Dish from "../model/dish.js";
import bcrypt from "bcryptjs";
import cloudinary from "../utils/cloudinary.js";
import { PUBLIC_MENU_PROJECTION } from "../utils/projections.js";
import {
  checkTokenValidity,
  expirationTime,
  generateResetToken,
  generateToken,
} from "../utils/jwt.js";
import {sendEmail} from "../utils/sendgrid.js";
import ActivityLog from "../model/activityLog.js";
import sendDiscordAlert from "../utils/discordAlert.js";

//TODO: split logic to different layers (like repository for db accessing) and files (like bcrypt and cloudinary)
const createUser = async (req, res) => {
  const {email, password, restaurantName, displayName, phone} = req.body;

  if (!email || !password || !restaurantName) {
    return res.status(400).json({message: "All fields are required"});
  }

  try {
    const existUser = await User.findOne({email});
    if (existUser) {
      return res.status(400).json({message: "User already exists"});
    }

    let logoUrl = null;

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              public_id: `users/${email}_logo`,
              folder: "users", // Store the image in the "users" folder
              transformation: {
                quality: "auto",
                fetch_format: "auto",
                width: 1000,
                crop: "limit",
              },
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          )
          .end(req.file.buffer);
      });
      logoUrl = uploadResult.secure_url; // Get the Cloudinary secure URL for the logo
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user instance
    const newUser = new User({
      email,
      password: hashedPassword,
      restaurantName,
      logo: logoUrl || null,
      designNumber: 1,
      displayName,
      phone,
    });

    await newUser.save();
    await sendDiscordAlert(
      `לקוח חדש פתח תפריט!\n**אימייל:** ${newUser.email}`,
      "🎉 משתמש חדש ב-iMenu!",
      3066993, // צבע ירוק להצלחה
    );
    const token = generateToken(newUser);

    const {password: _, ...userWithoutPassword} = newUser.toObject();

    res.status(201).json({user: userWithoutPassword, token: token});
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({message: error.message});
  }
};

const loginUser = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({message: "Email or password is incorrect"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({message: "Invalid credentials"});
    }

    const now = new Date();
    const isTrialExpired = !user.isPaid && user.trialExpiresAt < now;

    user.lastLogin = now;
    await user.save().catch(err => console.error("Failed to update last login:", err.message));

    const token = generateToken(user);
    const expireTime = expirationTime();

    const {password: _, ...userWithoutPassword} = user.toObject();

    res.status(200).json({
      user: userWithoutPassword,
      isTrialExpired: isTrialExpired,
      token: token,
      expireTime: expireTime,
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({message: error.message});
  }
};

const updateUser = async (req, res) => {
  const {email, password, restaurantName, isPaid, role, displayName, menuDescription, phone} =
    req.body;
  const {userId} = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    // Update email if provided
    if (email) {
      const existingUser = await User.findOne({email});
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({message: "Email already in use"});
      }
      user.email = email;
    }

    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    if (restaurantName) user.restaurantName = restaurantName;
    if (displayName) user.displayName = displayName;
    if (menuDescription !== undefined) user.menuDescription = menuDescription;
    if (phone) user.phone = phone;

    // --- לוגיקת אדמין ותשלומים ---
    if (isPaid !== undefined || role !== undefined) {
      if (!req.user || req.user.role !== "admin") {
        return res
          .status(403)
          .json({message: "Forbidden: Admin privileges required"});
      }

      if (isPaid !== undefined) {
        const previousStatus = user.isPaid;
        user.isPaid = isPaid;

        // אם הסטטוס שונה ל-true (שולם)
        if (isPaid === true || isPaid === "true") {
          // הגדרת תאריך לתשלום הבא - 30 יום מהיום
          const nextMonth = new Date();
          nextMonth.setDate(nextMonth.getDate() + 30);
          user.nextPaymentDate = nextMonth;

          // שליחת התראה לדיסקורד (רק אם זה באמת השתנה לחיוב)
          if (previousStatus !== true) {
            sendDiscordAlert(
              `המנוי של **${user.restaurantName}** חודש ידנית.\nתאריך תשלום הבא: ${nextMonth.toLocaleDateString("he-IL")}`,
              "💰 עדכון תשלום ידני",
              3066993, // ירוק
              "activity",
            );
          }
        }
      }

      if (role !== undefined) user.role = role;
    }

    // Handle image upload
    if (req.file) {
      if (user.logo) {
        const publicId = user.logo.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`users/${publicId}`);
      }

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              public_id: `users/${user.email}_logo`,
              folder: "users",
              transformation: {
                quality: "auto",
                fetch_format: "auto",
                width: 1000,
                crop: "limit",
              },
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          )
          .end(req.file.buffer);
      });
      user.logo = uploadResult.secure_url;
    }

    // שמירה סופית של כל השינויים
    await user.save();

    const token = generateToken(user);
    const {password: _, ...userResponse} = user.toObject();

    res.status(200).json({user: userResponse, token});
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({message: "Server error"});
  }
};

const findRestaurantsByName = async (req, res) => {
  const {name} = req.query;

  if (!name) {
    return res.status(400).json({message: "Name parameter is required"});
  }

  try {
    const restaurant = await User.find({
      restaurantName: {$regex: new RegExp(`^${name}$`, "i")},
    });

    if (!restaurant || restaurant.length === 0) {
      return res.status(404).json({message: "Restaurant not found"});
    }

    const {password: _, ...userWithoutPassword} = restaurant[0].toObject();
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const deleteUser = async (req, res) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (!user) {
    return res.status(401).json({message: "Email or password is incorrect"});
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({message: "Invalid credentials"});
  }
  try {
    await user.deleteOne();
    res.status(200).json({message: "User deleted successfully"});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const updateDesignByNumber = async (req, res) => {
  const {userId, number} = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }
    user.designNumber = number;
    await user.save();
    res.status(200).json({
      message: "Design updated successfully",
      user: user,
      design: user.designNumber,
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};
const updateUserMenuSettings = async (req, res) => {
  const {userId, wifiSsid, wifiPassword, isEnabled} = req.body;
  console.log(userId, wifiSsid, wifiPassword, isEnabled);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    if (!user.wifiSettings) {
      user.wifiSettings = {};
    }
    // if (!user.addressSettings) {
    //   user.addressSettings = {};
    // }

    if (wifiSsid) {
      user.wifiSettings.ssid = wifiSsid;
    }
    if (wifiPassword) {
      user.wifiSettings.wifiPassword = wifiPassword;
    }
    user.wifiSettings.isEnabled = isEnabled;

    // if (address) {
    //   user.addressSettings.address = address;
    // }
    // user.addressSettings.isEnabled = displayAddress;

    await user.save();

    res
      .status(200)
      .json({message: "User menu settings updated successfully", user});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const SendResetPasswordMail = async (req, res) => {
  const {to, userName} = req.body;
  console.log("קלט שהתקבל:", {to, userName});

  if (!to || !userName) {
    return res.status(400).json({
      success: false,
      message: "חסרים שדות חובה לשליחת האימייל.",
    });
  }

  try {
    const user = await User.findOne({email: to});

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "משתמש לא נמצא עם כתובת האימייל שסופקה.",
      });
    }

    const resetToken = generateResetToken(user);
    const baseUrl = process.env.FRONTEND_URL?.endsWith("/")
      ? process.env.FRONTEND_URL.slice(0, -1)
      : process.env.FRONTEND_URL;
    const resetLink = `${baseUrl}/resetpassword?token=${resetToken}`;

    const templateId = process.env.TEMPLATEID;
    if (!templateId) {
      console.error("❌ TEMPLATEID חסר או לא מוגדר בקובץ .env");
      return res.status(500).json({
        success: false,
        message: "הגדרת תבנית המייל חסרה בשרת.",
      });
    }

    const result = await sendEmail({
      to: user.email,
      templateId: templateId,
      dynamicData: {
        resetLink,
        userName: user.restaurantName || user.email,
      },
    });

    if (result?.success) {
      return res.status(200).json({
        success: true,
        message: "נשלח מייל לאיפוס סיסמה בהצלחה.",
      });
    } else {
      console.error(
        "❌ SendGrid error:",
        JSON.stringify(result?.error, null, 2),
      );
      return res.status(500).json({
        success: false,
        message: "שליחת המייל נכשלה.",
        error: result?.error,
      });
    }
  } catch (error) {
    console.error("שגיאה בשליחת האימייל:", error);
    return res.status(500).json({
      success: false,
      message: "אירעה שגיאה בשרת בעת שליחת האימייל.",
    });
  }
};

const resetPassword = async (req, res) => {
  const {data} = req.body;
  const {token, newPassword} = data;

  // 1. בדיקת תקינות הטוקן דרך הפונקציה שב־utils
  const {valid, payload, message} = checkTokenValidity(token);

  if (!valid) {
    if (message === "jwt expired") {
      return res.status(401).json({message: "הקישור לאיפוס הסיסמה פג תוקף"});
    }
    return res.status(400).json({message: "הטוקן לא תקין"});
  }

  try {
    console.log(payload.userId);
    // 2. חיפוש המשתמש
    const user = await User.findById(payload._id);
    if (!user) {
      return res.status(404).json({message: "המשתמש לא נמצא"});
    }

    // 3. בדיקת סיסמה זהה
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res
        .status(400)
        .json({message: "הסיסמה החדשה לא יכולה להיות זהה לקודמת"});
    }

    // 4. עידכון הסיסמה
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({message: "הסיסמה אופסה בהצלחה"});
  } catch (error) {
    console.error("Error resetting password:", error.message);
    return res.status(500).json({message: "שגיאת שרת פנימית"});
  }
};

const findBySlug = async (req, res) => {
  const {slug} = req.params;

  if (!slug) {
    return res.status(400).json({message: "Slug parameter is required"});
  }

  try {
    const user = await User.findOne({qrSlug: slug});

    if (!user) {
      return res.status(404).json({message: "Menu not found"});
    }

    const {password: _, ...userWithoutPassword} = user.toObject();
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const getQrScanCount = async (req, res) => {
  const {userId} = req.params;
  try {
    const user = await User.findById(userId).select("totalQrScans").lean();
    if (!user) return res.status(404).json({message: "User not found"});
    res.status(200).json({totalQrScans: user.totalQrScans || 0});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const handleQrRedirect = async (req, res) => {
  const {slug} = req.params;

  try {
    const user = await User.findOne({qrSlug: slug});

    // הדומיין הראשי שלך
    const baseDomain = process.env.MAIN_DOMAIN || "imenu-il.online";

    if (!user) {
      // הפניה לעמוד שגיאה בדומיין הראשי
      return res.redirect(302, `https://${baseDomain}/not-found`);
    }

    // עדכון מונה הסריקות (רץ ברקע)
    User.updateOne({qrSlug: slug}, {$inc: {totalQrScans: 1}}).catch((err) => {
      console.error(
        `Failed to increment scan counter for slug ${slug}:`,
        err.message,
      );
    });

    // תיעוד סריקה באנליטיקות שעות עומס (רץ ברקע)
    ActivityLog.create({restaurantId: user._id, type: "qr_scan"}).catch(
      (err) => {
        console.error(
          `Failed to log QR scan activity for slug ${slug}:`,
          err.message,
        );
      },
    );

    // בניית הכתובת: https://slug.imenu-il.online/menu
    const redirectUrl = `https://${slug}.${baseDomain}/menu`;

    return res.redirect(302, redirectUrl);
  } catch (error) {
    console.error("Error handling QR redirect:", error.message);
    const baseDomain = process.env.MAIN_DOMAIN || "imenu-il.online";
    return res.redirect(302, `https://${baseDomain}/not-found`);
  }
};

const completeTour = async (req, res) => {
  const {userId} = req.body;

  // Ensure the user is updating their own record or is an admin
  if (req.user._id.toString() !== userId && req.user.role !== "admin") {
    return res.status(403).json({message: "Forbidden"});
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }
    user.hasCompletedTour = true;
    await user.save();
    res
      .status(200)
      .json({message: "Tour completed successfully", hasCompletedTour: true});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Server error"});
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }
    const {password: _, ...userWithoutPassword} = user.toObject();
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const getFullMenu = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const enableSubCategories = user.enableSubCategories === true;

    // Fetch all categories for user
    const allCategories = await Category.find({ userId })
      .select(PUBLIC_MENU_PROJECTION)
      .lean();

    // Fetch all dishes for user
    const allDishes = await Dish.find({ userId })
      .select(PUBLIC_MENU_PROJECTION)
      .lean();

    // Sort dishes safely
    allDishes.sort((a, b) => {
      const locA = a.locationNumber != null ? a.locationNumber : Infinity;
      const locB = b.locationNumber != null ? b.locationNumber : Infinity;
      return locA - locB;
    });

    const dishesMap = {};

    if (!enableSubCategories) {
      // LEGACY FLAT RESPONSE
      allCategories.forEach((category) => {
        dishesMap[category._id] = allDishes.filter(
          (dish) => String(dish.category) === String(category._id)
        );
      });

      return res.status(200).json({
        categories: allCategories,
        dishes: dishesMap,
        lastUpdated: new Date().getTime(),
      });
    }

    // NEW NESTED RESPONSE
    const topLevelCategories = allCategories.filter((cat) => !cat.parentCategory);
    const subCategories = allCategories.filter((cat) => cat.parentCategory);

    // Group dishes by their direct category
    const dishesByCategory = {};
    allDishes.forEach((dish) => {
      const catId = String(dish.category);
      if (!dishesByCategory[catId]) {
        dishesByCategory[catId] = [];
      }
      dishesByCategory[catId].push(dish);
    });

    topLevelCategories.forEach((topCat) => {
      const topCatId = String(topCat._id);
      dishesMap[topCatId] = [];

      // Find sub-categories that belong to this top-level category
      const relatedSubCats = subCategories.filter(
        (subCat) => String(subCat.parentCategory) === topCatId
      );

      // Add sub-categories (with their dishes)
      relatedSubCats.forEach((subCat) => {
        const subCatId = String(subCat._id);
        const subCatDishes = dishesByCategory[subCatId] || [];
        dishesMap[topCatId].push({
          ...subCat,
          dishes: subCatDishes,
        });
      });

      // Add dishes that belong directly to the top-level category
      const directDishes = dishesByCategory[topCatId] || [];
      if (directDishes.length > 0) {
        dishesMap[topCatId].push(...directDishes);
      }
    });

    return res.status(200).json({
      categories: topLevelCategories,
      dishes: dishesMap,
      lastUpdated: new Date().getTime(),
    });
  } catch (error) {
    console.error("Error in getFullMenu:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export {
  getAllUsers,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  findRestaurantsByName,
  updateDesignByNumber,
  updateUserMenuSettings,
  SendResetPasswordMail,
  resetPassword,
  handleQrRedirect,
  findBySlug,
  getQrScanCount,
  completeTour,
  getCurrentUser,
  getFullMenu,
};
