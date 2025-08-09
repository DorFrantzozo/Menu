import User from "../model/user.js";
import bcrypt from "bcryptjs";
import cloudinary from "../utils/cloudinary.js";
import { checkTokenValidity, expirationTime, generateToken } from "../utils/jwt.js";
import { sendEmail } from "../utils/sendgrid.js";


//TODO: split logic to different layers (like repository for db accessing) and files (like bcrypt and cloudinary)
const createUser = async (req, res) => {
  const { email, password, restaurantName, displayName, phone } = req.body;

  if (!email || !password || !restaurantName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
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
              },
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
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

    const token = generateToken(newUser);

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    //TODO: Token on cookie (because of security)
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production", // Set to true in production
    //   sameSite: "strict",
    // });

    res.status(201).json({ user: userWithoutPassword, token: token });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const now = new Date();
    const isTrialExpired = !user.isPaid && user.trialExpiresAt < now;

    const token = generateToken(user);
    const expireTime = expirationTime();

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      user: userWithoutPassword,
      isTrialExpired: isTrialExpired,
      token: token,
      expireTime: expireTime,
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { email, password, restaurantName, isPaid, displayName, phone } =
    req.body;
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update email if provided
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Update restaurant name if provided
    if (restaurantName) {
      user.restaurantName = restaurantName;
    }

    // Update displayName if provided
    if (displayName) {
      user.displayName = displayName;
    }

    // Update phone if provided
    if (phone) {
      user.phone = phone;
    }

    // Update payment status if provided
    if (isPaid !== undefined) {
      user.isPaid = isPaid;
    }

    // Handle image upload to Cloudinary if a new file is present
    if (req.file) {
      if (user.logo) {
        // If the user already has a logo, delete it from Cloudinary
        const publicId = user.logo.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`users/${publicId}`);
      }

      // Upload new logo to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              public_id: `users/${user.email}_logo`,
              folder: "users",
              transformation: {
                quality: "auto",
                fetch_format: "auto",
              },
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          )
          .end(req.file.buffer);
      });

      user.logo = uploadResult.secure_url; // Update user logo URL with the new one
    }

    // Save the updated user
    await user.save();

    // Generate a new token if the user updated their email or password
    const token = generateToken(user);

    // Exclude the password before sending the response
    const { password: _, ...updatedUser } = user.toObject();

    res.status(200).json({ user: updatedUser, token });
  } catch (error) {
    console.error("Error updating user:", error.message);
    console.error(error); // Log the entire error object for more details
    res.status(500).json({ message: "Server error" });
  }
};

const findRestaurantsByName = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: "Name parameter is required" });
  }

  try {
    const restaurant = await User.find({
      restaurantName: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (!restaurant || restaurant.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const { password: _, ...userWithoutPassword } = restaurant[0].toObject();
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Email or password is incorrect" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  try {
    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDesignByNumber = async (req, res) => {
  const { userId, number } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.designNumber = number;
    await user.save();
    res.status(200).json({
      message: "Design updated successfully",
      user: user,
      design: user.designNumber,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateUserMenuSettings = async (req, res) => {
  const { userId, wifiSsid, wifiPassword, isEnabled } = req.body;
  console.log(userId, wifiSsid, wifiPassword, isEnabled);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
      .json({ message: "User menu settings updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const SendResetPasswordMail = async (req, res) => {
  const { to, userName } = req.body;
  console.log("קלט שהתקבל:", { to, userName });

  if (!to || !userName) {
    return res.status(400).json({
      success: false,
      message: "חסרים שדות חובה לשליחת האימייל.",
    });
  }

  try {
    const user = await User.findOne({ email: to });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "משתמש לא נמצא עם כתובת האימייל שסופקה.",
      });
    }

    const resetToken = generateToken(user);
    const resetLink = `${process.env.CLIENT_BASE_URL}/resetpassword?token=${resetToken}`;

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
      console.error("❌ SendGrid error:", JSON.stringify(result?.error, null, 2));
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
  const { data } = req.body;
  const { token, newPassword } = data;

  // 1. בדיקת תקינות הטוקן דרך הפונקציה שב־utils
  const { valid, payload, message } = checkTokenValidity(token);

  if (!valid) {
    if (message === "jwt expired") {
      return res.status(401).json({ message: "הקישור לאיפוס הסיסמה פג תוקף" });
    }
    return res.status(400).json({ message: "הטוקן לא תקין" });
  }

  try {
    console.log(payload.userId)
    // 2. חיפוש המשתמש
    const user = await User.findById(payload._id);
    if (!user) {
      return res.status(404).json({ message: "המשתמש לא נמצא" });
    }

    // 3. בדיקת סיסמה זהה
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "הסיסמה החדשה לא יכולה להיות זהה לקודמת" });
    }

    // 4. עידכון הסיסמה
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "הסיסמה אופסה בהצלחה" });
  } catch (error) {
    console.error("Error resetting password:", error.message);
    return res.status(500).json({ message: "שגיאת שרת פנימית" });
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
  resetPassword
};
