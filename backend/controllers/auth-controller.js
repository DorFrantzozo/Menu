import User from "../model/user.js";
import bcrypt from "bcryptjs";
import {AssetFolder, uploadTenantAsset} from "../utils/cloudinary.js";
import {
  checkTokenValidity,
  expirationTime,
  generateResetToken,
  generateToken,
  generateVerificationToken,
} from "../utils/jwt.js";
import {sendEmail} from "../utils/sendgrid.js";
import sendDiscordAlert from "../utils/discordAlert.js";

export const createUser = async (req, res) => {
  const {email, password, restaurantName, displayName, phone} = req.body;

  if (!email || !password || !restaurantName) {
    return res.status(400).json({message: "All fields are required"});
  }

  try {
    const existUser = await User.findOne({email});
    if (existUser) {
      return res.status(400).json({message: "User already exists"});
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user instance - with isVerified: false by default.
    // Nothing is persisted until save(), but the _id is already assigned and is
    // what namespaces this restaurant's media folder.
    const newUser = new User({
      email,
      password: hashedPassword,
      restaurantName,
      logo: null,
      designNumber: 1,
      displayName,
      phone,
      isVerified: false,
    });

    if (req.file) {
      const uploadResult = await uploadTenantAsset({
        buffer: req.file.buffer,
        userId: newUser._id,
        folder: AssetFolder.BRANDING,
        publicId: "logo",
        displayName: restaurantName,
      });
      newUser.logo = uploadResult.secure_url;
    }

    await newUser.save();

    // Instead of logging in, send verification email
    const verificationToken = generateVerificationToken(newUser);
    const baseUrl = process.env.FRONTEND_URL?.endsWith("/")
      ? process.env.FRONTEND_URL.slice(0, -1)
      : process.env.FRONTEND_URL;
    
    // We'll map this on the frontend to hit the verify endpoint
    const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}`;
    
    const templateId = process.env.SENDGRID_EMAIL_VERIFICATION;
    if (!templateId) {
      console.warn("SENDGRID_EMAIL_VERIFICATION is missing in .env, user created but email not sent.");
    } else {
      await sendEmail({
        to: newUser.email,
        templateId: templateId,
        subject: "אימות חשבון חדש ב-iMenu",
        dynamicData: {
          verification_url: verificationLink,
          userName: newUser.restaurantName || newUser.email,
        },
      });
    }

    // We don't send discord alert yet (wait for verification) and don't return login token
    res.status(201).json({
      message: "User created successfully. Please check your email to verify your account.",
      requiresVerification: true
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({message: error.message});
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "טוקן אימות חסר" });
  }

  const { valid, payload, message } = checkTokenValidity(token);

  if (!valid) {
    if (message === "jwt expired") {
      return res.status(401).json({ message: "הקישור לאימות פג תוקף" });
    }
    return res.status(400).json({ message: "הטוקן לא תקין" });
  }

  try {
    const user = await User.findById(payload._id);
    if (!user) {
      return res.status(404).json({ message: "המשתמש לא נמצא" });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "המשתמש כבר אומת בעבר" });
    }

    user.isVerified = true;
    await user.save();

    // Now send the discord alert
    await sendDiscordAlert(
      `לקוח חדש אימת תפריט!\n**אימייל:** ${user.email}\n**שם מסעדה:** ${user.restaurantName}`,
      "🎉 משתמש חדש אומת ב-iMenu!",
      3066993,
    );

    res.status(200).json({ message: "האימייל אומת בהצלחה! כעת ניתן להתחבר." });
  } catch (error) {
    console.error("Error verifying email:", error.message);
    res.status(500).json({ message: "שגיאת שרת בעת אימות האימייל" });
  }
};

export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "אימייל חסר" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "משתמש לא נמצא" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "המשתמש כבר אומת בעבר" });
    }

    const verificationToken = generateVerificationToken(user);
    const baseUrl = process.env.FRONTEND_URL?.endsWith("/")
      ? process.env.FRONTEND_URL.slice(0, -1)
      : process.env.FRONTEND_URL;
    const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}`;
    
    const templateId = process.env.SENDGRID_EMAIL_VERIFICATION;
    if (!templateId) {
      return res.status(500).json({ message: "הגדרת תבנית אימות חסרה בשרת." });
    }

    const result = await sendEmail({
      to: user.email,
      templateId: templateId,
      subject: "אימות חשבון חדש ב-iMenu",
      dynamicData: {
        verification_url: verificationLink,
        userName: user.restaurantName || user.email,
      },
    });

    if (result?.success) {
      res.status(200).json({ message: "מייל אימות נשלח בהצלחה." });
    } else {
      res.status(500).json({ message: "שליחת המייל נכשלה." });
    }
  } catch (error) {
    console.error("Error resending verification email:", error.message);
    res.status(500).json({ message: "שגיאת שרת בעת שליחת אימייל אימות" });
  }
};

export const loginUser = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({message: "Email or password is incorrect"});
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: "יש לאמת את כתובת האימייל לפני ההתחברות.",
        requiresVerification: true
      });
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

export const SendResetPasswordMail = async (req, res) => {
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

    const templateId = process.env.SENDGRID_RESET_PASSWORD_TEMPLATEID || process.env.TEMPLATEID;
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
      subject: "איפוס סיסמה למערכת iMenu",
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

export const resetPassword = async (req, res) => {
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
