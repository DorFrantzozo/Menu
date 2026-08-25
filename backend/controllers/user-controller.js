import User from "../model/user.js";
import Category from "../model/category.js";
import Dish from "../model/dish.js";
import bcrypt from "bcryptjs";
import {
  AssetFolder,
  destroyTenantAsset,
  uploadTenantAsset,
} from "../utils/cloudinary.js";
import {
  PUBLIC_MENU_PROJECTION,
  PUBLIC_USER_PROJECTION,
} from "../utils/projections.js";
import {
  normalizeReviewUrl,
  coercePromptDelay,
  isReviewPromptReady,
  DEFAULT_PROMPT_DELAY_MINUTES,
} from "../utils/reviewUrl.js";
import {
  generateToken,
} from "../utils/jwt.js";
import ActivityLog from "../model/activityLog.js";
import sendDiscordAlert from "../utils/discordAlert.js";

//TODO: split logic to different layers (like repository for db accessing) and files (like bcrypt and cloudinary)

const updateUser = async (req, res) => {
  const {
    email,
    password,
    restaurantName,
    isPaid,
    role,
    displayName,
    menuDescription,
    phone,
    // Review prompt. Flat keys because the profile form posts multipart
    // FormData, which cannot carry nested objects.
    googleReviewUrl,
    reviewPromptEnabled,
    promptDelayMinutes,
  } = req.body;
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

    // --- Google review prompt ---
    if (!user.reviewSettings) {
      user.reviewSettings = {};
    }
    if (googleReviewUrl !== undefined) {
      const normalized = normalizeReviewUrl(googleReviewUrl);
      user.reviewSettings.googleReviewUrl = normalized.googleReviewUrl;
      user.reviewSettings.resolvedUrl = normalized.resolvedUrl;
      user.reviewSettings.urlStatus = normalized.urlStatus;
      user.reviewSettings.verifiedAt = new Date();
      // A link we could not make sense of must not leave the prompt live.
      if (normalized.urlStatus !== "valid") {
        user.reviewSettings.isEnabled = false;
      }
    }
    if (reviewPromptEnabled !== undefined) {
      const wants =
        reviewPromptEnabled === true || reviewPromptEnabled === "true";
      // Switching it on is only meaningful once a link actually resolves.
      user.reviewSettings.isEnabled =
        wants && user.reviewSettings.urlStatus === "valid";
    }
    if (promptDelayMinutes !== undefined) {
      user.reviewSettings.promptDelayMinutes =
        coercePromptDelay(promptDelayMinutes);
    }

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
      // Remove the previous logo (best effort — never blocks the update)
      await destroyTenantAsset(user.logo, userId);

      const uploadResult = await uploadTenantAsset({
        buffer: req.file.buffer,
        userId,
        folder: AssetFolder.BRANDING,
        publicId: "logo",
        displayName: user.restaurantName,
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
    // Unauthenticated endpoint: never widen this beyond PUBLIC_USER_PROJECTION.
    const restaurant = await User.find({
      restaurantName: {$regex: new RegExp(`^${name}$`, "i")},
    })
      .select(PUBLIC_USER_PROJECTION)
      .lean();

    if (!restaurant || restaurant.length === 0) {
      return res.status(404).json({message: "Restaurant not found"});
    }

    res.status(200).json(restaurant[0]);
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


const findBySlug = async (req, res) => {
  const {slug} = req.params;

  if (!slug) {
    return res.status(400).json({message: "Slug parameter is required"});
  }

  try {
    // Unauthenticated endpoint: never widen this beyond PUBLIC_USER_PROJECTION.
    // `plan` and `reviewSettings` are read for the gate below and stripped
    // before responding — only the two fields the prompt needs go out.
    const user = await User.findOne({qrSlug: slug})
      .select(`${PUBLIC_USER_PROJECTION} plan reviewSettings`)
      .lean();

    if (!user) {
      return res.status(404).json({message: "Menu not found"});
    }

    const {plan, reviewSettings, ...publicUser} = user;

    // Gates 1-4 for the review prompt, all enforced here so the client is left
    // with a single condition and the feature cannot be switched on from
    // DevTools. Same subscription test the menu itself uses.
    const subscriptionActive =
      user.isPaid ||
      !user.trialExpiresAt ||
      new Date(user.trialExpiresAt) > new Date();

    if (
      plan === "iMenu PRO" &&
      subscriptionActive &&
      isReviewPromptReady(reviewSettings)
    ) {
      publicUser.reviewSettings = {
        resolvedUrl: reviewSettings.resolvedUrl,
        promptDelayMinutes:
          reviewSettings.promptDelayMinutes ?? DEFAULT_PROMPT_DELAY_MINUTES,
      };
    }

    res.status(200).json(publicUser);
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
  const {userId} = req.params;
  if (!userId) {
    return res.status(400).json({message: "User ID is required"});
  }

  try {
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    const enableSubCategories = user.enableSubCategories === true;

    // Fetch all categories for user
    const allCategories = await Category.find({userId})
      .select(PUBLIC_MENU_PROJECTION)
      .lean();

    // Fetch all dishes for user
    const allDishes = await Dish.find({userId})
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
          (dish) => String(dish.category) === String(category._id),
        );
      });

      return res.status(200).json({
        categories: allCategories,
        dishes: dishesMap,
        lastUpdated: new Date().getTime(),
      });
    }

    // NEW NESTED RESPONSE
    const topLevelCategories = allCategories.filter(
      (cat) => !cat.parentCategory,
    );
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
        (subCat) => String(subCat.parentCategory) === topCatId,
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
    return res.status(500).json({message: "Server error"});
  }
};

export {
  getAllUsers,
  updateUser,
  deleteUser,
  findRestaurantsByName,
  updateDesignByNumber,
  updateUserMenuSettings,
  handleQrRedirect,
  findBySlug,
  getQrScanCount,
  completeTour,
  getCurrentUser,
  getFullMenu,
};
