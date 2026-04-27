import {UserWallet} from "../model/userWallet.js"; // הנתיב למודל שלך

export const verifyAiCredits = async (req, res, next) => {
  try {
    // נניח שה-ID של המשתמש מגיע מהטוקן/סשן
    const userId = req.user._id;

    // שולפים את הארנק
    let wallet = await UserWallet.findOne({userId});

    // אם אין לו ארנק (לקוח חדש), נייצר לו אחד במקום
    if (!wallet) {
      wallet = await UserWallet.create({
        userId,
        dailyLimit: 10,
        usedToday: 0,
      });
    }

    // --- איפוס יומי חכם ---
    const now = new Date();
    const lastUsage = new Date(wallet.lastUsageDate);

    // בודקים אם התאריך של היום שונה מהתאריך השמור (חצות עבר)
    const isNewDay =
      now.getDate() !== lastUsage.getDate() ||
      now.getMonth() !== lastUsage.getMonth() ||
      now.getFullYear() !== lastUsage.getFullYear();

    if (isNewDay) {
      wallet.usedToday = 0;
      wallet.lastUsageDate = now;
      await wallet.save(); // שומרים את האיפוס
    }

    // --- בדיקת חסימה ---
    if (wallet.usedToday >= wallet.dailyLimit) {
      return res.status(403).json({
        success: false,
        message:
          "ניצלת את 10 סבבי הקריאייטיב שלך להיום. מחר נפתח יום חדש של שיווק.",
      });
    }

    // מעבירים את הארנק לקונטרולר כדי שיוכל לחייב אותו אחרי ש-Groq מסיים
    req.wallet = wallet;

    next(); // נותנים אור ירוק להמשיך ל-Groq!
  } catch (error) {
    console.error("Credit check error:", error);
    res
      .status(500)
      .json({success: false, message: "שגיאה זמנית במערכת הבקרה."});
  }
};
