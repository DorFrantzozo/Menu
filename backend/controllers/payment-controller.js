import User from "../model/user.js";
import {createPaymentLink} from "../services/MorningService.js";
import Payment from "../model/payment.js";

export const startCheckout = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("🚀 Starting checkout for User ID:", userId);

    // 1. חילוץ הנתונים מהבקשה (מה ששלחנו מה-CheckoutPage)
    const {planName, ...checkoutData} = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: "User not found in Database"});
    }

    // 2. תיקון קריטי: העברת planName ו-checkoutData לפונקציה
    // עכשיו MorningService יוכל לקרוא את fullName, email וכו'
    const paymentSession = await createPaymentLink(
      user,
      planName,
      checkoutData,
    );

    // החזרת הלינק לפרונט
    res.status(200).json({url: paymentSession.url || paymentSession.link});
  } catch (error) {
    console.error("❌ Checkout Controller Error:", error.message);
    res.status(500).json({message: error.message});
  }
};
const recordPaymentInDB = async (userId, payload, assignedPlan) => {
  try {
    await Payment.create({
      userId: userId,
      morningPaymentId: payload.id, // ה-ID של מורנינג
      amount: Number(payload.amount) || 0,
      currency: payload.currency || "ILS",
      status: "success",
      documentUrl: payload.files?.downloadLinks?.origin || "", // לינק להורדת הקבלה
      documentNumber: payload.number || "0",
      description: payload.description || `מנוי iMenu - מסלול ${assignedPlan}`,
      paymentDate: new Date(),
    });
    console.log(`📑 Payment record created for user ${userId}`);
  } catch (error) {
    console.error("❌ Failed to record payment in DB:", error.message);
    // אנחנו לא עוצרים את ה-Webhook אם רק הרישום נכשל, אבל מתעדים את השגיאה
  }
};

export const morningWebhookHandler = async (req, res) => {
  const payload = req.body;
  const userId = payload.custom;

  // תיקון ה-NaN: המרה למספר ושימוש ב-0 כברירת מחדל
  const paidAmount = Number(payload.amount) || 0;

  // בדיקה אם זה אירוע רלוונטי (דף תשלום או הפקת מסמך)
  if (userId && (payload.type === 400 || payload.type === 320)) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        console.error(`❌ User ${userId} not found in DB`);
        return res.status(200).send("OK");
      }

      // שכפ"ץ כפילויות
      if (user.isPaid && user.nextPaymentDate > new Date()) {
        console.log(`⚠️ User ${user.email} already active. Skipping.`);
        return res.status(200).send("OK");
      }

      const PRICE_PRO = Number(process.env.PRICE_PRO) || 7500;
      const PRICE_ADVANCE = Number(process.env.PRICE_ADVANCE) || 4500;

      let assignedPlan = "Essential";
      if (paidAmount >= PRICE_PRO) {
        assignedPlan = "iMenu PRO";
      } else if (paidAmount >= PRICE_ADVANCE) {
        assignedPlan = "Advance";
      }
      await recordPaymentInDB(userId, payload, assignedPlan);
      // הגדרת תוקף לשנה (365 ימים מהיום)
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);

      // עדכון המשתמש עם $set למניעת דריסת שדות אחרים
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            isPaid: true,
            plan: assignedPlan,
            nextPaymentDate: nextYear,
            // פתיחת עיצוב אישי רק ל-PRO
            "themeSettings.isCustomDesign": assignedPlan === "iMenu PRO",
            // שמירת מזהה לקוח ממורנינג לשימוש עתידי
            morningCustomerId: payload.recipient?.id,
          },
        },
        {new: true},
      );

      console.log(
        `✅ SUCCESS: User ${updatedUser.email} upgraded to ${assignedPlan} | Amount: ₪${paidAmount}`,
      );
    } catch (error) {
      // כאן ה-NaN היה גורם לקריסה, עכשיו זה מוגן
      console.error("❌ Error in Webhook processing:", error.message);
      return res.status(500).send("Internal Server Error");
    }
  }

  // תמיד מחזירים 200 למורנינג כדי שיפסיקו לשלוח את אותו אירוע
  res.status(200).send("OK");
};

export const getUserPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({userId: req.user._id}).sort({
      createdAt: -1,
    });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({message: "שגיאה בשליפת היסטוריה"});
  }
};
