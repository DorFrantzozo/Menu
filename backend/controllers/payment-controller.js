import User from "../model/user.js";
import {createPaymentLink, morningRequest} from "../services/MorningService.js";
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
    // --- תחילת טיפול השגיאות המעודכן ---

    // מנסים לחלץ את קוד והודעת השגיאה המקוריים שמורנינג החזירו
    const morningErrorCode =
      error.response?.data?.errorCode || error.response?.data?.error;
    const morningErrorMessage =
      error.response?.data?.errorMessage ||
      error.response?.data?.error_description;

    // אם יש קוד שגיאה ממורנינג (למשל 1111 או 2014), נחזיר סטטוס 400 לפרונט
    if (morningErrorCode) {
      console.error(
        `❌ Morning API Error [${morningErrorCode}]:`,
        morningErrorMessage,
      );
      return res.status(400).json({
        success: false,
        errorCode: morningErrorCode,
        message: morningErrorMessage || "שגיאה מול חברת הסליקה",
      });
    }

    // אם זו שגיאה כללית אחרת בשרת, נחזיר סטטוס 500 כמקודם
    console.error("❌ Checkout Controller Error:", error.message);
    res.status(500).json({message: error.message});

    // --- סוף טיפול השגיאות המעודכן ---
  }
};

const recordPaymentInDB = async (userId, payload, assignedPlan) => {
  try {
    await Payment.create({
      userId: userId,
      morningPaymentId: payload.id, // ה-ID של מורנינג
      amount: Number(payload.amount) || 1,
      currency: payload.currency || "ILS",
      status: "success",
      documentUrl: payload.url.origin || "", // לינק להורדת הקבלה
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
  const userId = payload.external_data; // המזהה שלנו ב-DB ששלחנו למורנינג

  if (
    payload.type !== 400 &&
    payload.type !== "400" &&
    payload.type !== 320 &&
    payload.type !== "320"
  ) {
    console.log(
      `⚠️ Ignoring webhook of type ${payload.type}. We only process documents (400/320).`,
    );
    return res.status(200).send("OK");
  }
  console.log("📥 Morning Webhook Received for payload:", payload);

  console.log(
    `🔍 Fetching full document details for internal ID: ${payload.id}...`,
  );
  const fullDocument = await morningRequest("GET", `/documents/${payload.id}`);

  console.log("Full Document:", fullDocument);
  const paidAmount = Number(fullDocument.amount) || 1;
  console.log("Paid Amount:", paidAmount);

  // מוודאים שיש לנו משתמש ושהאירוע הוא הפקת מסמך/תשלום
  if (userId && (fullDocument.type === 400 || fullDocument.type === 320)) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        console.error(`❌ User ${userId} not found in DB`);
        return res.status(200).send("OK");
      }

      // --- הגדרות מחירים (שים לב שאלו מחירים בשקלים, לא אגורות) ---
      // אם ב-.env שלך כתוב 7500 הכוונה ל-75 ש"ח, שנה זאת ל-75.
      const PRICE_PRO = Number(process.env.PRICE_PRO) || 85;
      const PRICE_ADVANCE = Number(process.env.PRICE_ADVANCE) || 45;
      console.log("PRICE_PRO:", PRICE_PRO);
      console.log("PRICE_ADVANCE:", PRICE_ADVANCE);

      let assignedPlan = "Essential";
      if (paidAmount >= PRICE_PRO) {
        assignedPlan = "iMenu PRO";
      } else if (paidAmount >= PRICE_ADVANCE) {
        assignedPlan = "Advance";
      }

      const extractedCustomerId = fullDocument.client.id;

      await recordPaymentInDB(userId, fullDocument, assignedPlan);

      // הגדרת תאריך חיוב הבא - חודש מהיום בדיוק
      const nextBilling = new Date();
      nextBilling.setMonth(nextBilling.getMonth() + 1);

      user.isPaid = true;
      user.plan = assignedPlan;
      user.subscriptionStatus = "active"; // משנים מ-trial ל-active
      user.nextPaymentDate = nextBilling;
      user.lastBilledDate = new Date();
      user.morningCustomerId = extractedCustomerId;
      user.lastFourDigits = fullDocument.payment?.cardNum;
      // עדכון בטוח של המשתמש-
      await user.save();

      console.log(
        `✅ SUCCESS: User ${user.email} | Plan: ${assignedPlan} | Amount: ₪${paidAmount}`,
      );
    } catch (error) {
      console.error("❌ Error in Webhook processing:", error.message);
      return res.status(500).send("Internal Server Error");
    }
  }

  // תמיד 200 בסוף כדי למנוע ממורנינג לנסות שוב ושוב
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
