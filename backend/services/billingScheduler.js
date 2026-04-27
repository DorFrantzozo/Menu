import cron from "node-cron";
import User from "../model/user.js"; // ודא שהנתיב נכון
import {chargeToken} from "./MorningService.js";

// תזמון לרוץ בכל יום בשעה 02:00 לפנות בוקר לפי שעון ישראל

console.log(
  "⏰ Monthly Billing Scheduler initialized for 02:00 Asia/Jerusalem",
);
/**
 * שירות האחראי על סריקת המשתמשים וביצוע חיובים חודשיים
 */
export const processMonthlyBillings = async () => {
  const startTime = new Date();
  console.log(
    `[${startTime.toLocaleString()}] 🌙 Starting monthly billing process...`,
  );

  try {
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    // 1. מציאת כל המשתמשים שצריכים לשלם היום (או שמועד התשלום שלהם עבר)
    const usersToBill = await User.find({
      subscriptionStatus: "active",
      isPaid: true,
      nextPaymentDate: {$lte: endOfToday}, // תאריך החיוב הוא היום או בעבר
      morningPaymentToken: {$exists: true}, // חובה שיהיה טוקן
      isBillingProcessing: {$ne: true}, // הגנה: המשתמש לא נמצא כרגע בתהליך חיוב אחר
    });

    if (usersToBill.length === 0) {
      console.log("✅ No pending billings for today.");
      return;
    }

    console.log(`🔎 Found ${usersToBill.length} users to bill.`);

    for (const user of usersToBill) {
      try {
        // 2. נעילת המשתמש זמנית ב-DB (Idempotency)
        user.isBillingProcessing = true;
        await user.save();

        // 3. קביעת הסכום לפי התוכנית שלו
        const PRICE_PRO = Number(process.env.PRICE_PRO) || 85;
        const PRICE_ADVANCE = Number(process.env.PRICE_ADVANCE) || 45;
        const PRICE_ESSENTIAL = Number(process.env.PRICE_ESSENTIAL) || 29;

        let amount = PRICE_ESSENTIAL;
        if (user.plan === "iMenu PRO") {
          amount = PRICE_PRO;
        } else if (user.plan === "Advance") {
          amount = PRICE_ADVANCE;
        }
        console.log(`💸 Charging ${user.email} - Amount: ₪${amount}`);

        // 4. קריאה לסרביס של מורנינג שכתבנו קודם
        const paymentResult = await chargeToken(user, amount, user.plan);

        if (paymentResult) {
          // 5. הצלחה: עדכון תאריך החיוב הבא לעוד חודש
          const nextDate = new Date(user.nextPaymentDate);
          nextDate.setMonth(nextDate.getMonth() + 1);

          user.nextPaymentDate = nextDate;
          user.lastBilledDate = new Date();
          user.subscriptionStatus = "active";
          console.log(
            `✅ Success: User ${user.email} billed. Next date: ${nextDate.toLocaleDateString()}`,
          );
        }
      } catch (error) {
        console.error(`❌ Failed to bill ${user.email}:`, error.message);

        // במקרה של כשל (סירוב כרטיס וכו'), מעבירים לסטטוס "חוב"
        user.subscriptionStatus = "past_due";
        // כאן אפשר להוסיף לוגיקה של שליחת מייל ללקוח: "עדכן אמצעי תשלום"
      } finally {
        // 6. שחרור הנעילה בכל מקרה
        user.isBillingProcessing = false;
        await user.save();
      }
    }
  } catch (error) {
    console.error("🚨 Critical Error in processMonthlyBillings:", error);
  }
};

cron.schedule(
  "0 2 * * *",
  async () => {
    await processMonthlyBillings();
  },
  {
    scheduled: true,
    timezone: "Asia/Jerusalem", // כאן קורה הקסם - זה ירוץ ב-02:00 של ישראל תמיד
  },
);
