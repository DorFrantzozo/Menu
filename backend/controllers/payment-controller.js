// server/controllers/payment-controller.js
import User from "../model/user.js";
import {createPaymentLink} from "../services/MorningService.js";

export const startCheckout = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("🚀 Starting checkout for User ID:", userId);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({message: "User not found in Database"});
    }

    const paymentSession = await createPaymentLink(user);

    // מורנינג מחזירה את הלינק בשדה שנקרא url או link - וודא שזה תואם ל-Service שלך
    res.status(200).json({url: paymentSession.url || paymentSession.link});
  } catch (error) {
    console.error("❌ Checkout Controller Error:", error.message);
    res.status(500).json({message: error.message});
  }
};

/**
 * Webhook Handler - מקבל עדכונים ממורנינג
 */
export const morningWebhookHandler = async (req, res) => {
  try {
    // מורנינג שולחת מידע רב ב-Body. אנחנו מתמקדים בסטטוס ובמידע המזהה
    const {event, data, custom, status} = req.body;

    console.log(
      `--- 📥 Morning Webhook Received: ${event || "Payment Update"} ---`,
    );
    console.log("Full Payload (for debug):", JSON.stringify(req.body, null, 2));

    // דרך א': זיהוי לפי שדה custom (הכי בטוח - זה ה-ID של המשתמש שלנו)
    // דרך ב': זיהוי לפי morningCustomerId (data.clientId)
    const userId = custom;
    const morningCustomerId = data?.clientId || data?.customerId;

    // אנחנו נשדרג את המשתמש אם הסטטוס הוא success או שנוצר מסמך
    if (
      status === "success" ||
      event === "document.created" ||
      event === "payment.created"
    ) {
      // חיפוש המשתמש - קודם לפי ה-ID שלנו (custom), ואם לא נמצא אז לפי ה-ID של מורנינג
      let user = await User.findById(userId);

      if (!user && morningCustomerId) {
        user = await User.findOne({morningCustomerId});
      }

      if (user) {
        console.log(`✨ Upgrading user ${user.email} to Premium...`);

        user.isPaid = true;
        // ליתר ביטחון, נשמור את ה-ID של מורנינג אם עוד לא שמרנו
        if (!user.morningCustomerId && morningCustomerId) {
          user.morningCustomerId = morningCustomerId;
        }

        // חישוב תאריך תשלום הבא
        const nextBilling = new Date();
        nextBilling.setDate(nextBilling.getDate() + 30);
        user.nextPaymentDate = nextBilling;

        await user.save();
        console.log(
          `✅ SUCCESS: User ${user.email} is now Premium until ${nextBilling.toLocaleDateString()}`,
        );
      } else {
        console.warn(
          `⚠️ Webhook Warning: No matching user found for CustomID: ${userId} or MorningID: ${morningCustomerId}`,
        );
      }
    }

    // חובה להחזיר 200 "OK" למורנינג כדי שלא ישלחו שוב ושוב את אותה הודעה (Retries)
    res.status(200).send("OK");
  } catch (error) {
    console.error("❌ Webhook Handler Error:", error.message);
    // גם בשגיאה, לפעמים עדיף להחזיר 200 כדי שמורנינג לא "יתקעו" עליך, או 500 אם אתה רוצה שינסו שוב
    res.status(500).send("Internal Error");
  }
};
