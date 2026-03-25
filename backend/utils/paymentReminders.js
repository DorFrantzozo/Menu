import cron from 'node-cron';
import User from '../model/user.js'; // ודא שהנתיב נכון
import sendDiscordAlert from './discordAlert.js';

// פונקציה שרצה כל יום ב-09:00 בבוקר
export const initPaymentReminders = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily payment check...');
    
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    // הגדרת טווח התאריכים לחיפוש (תחילת היום וסוף היום בעוד 3 ימים)
    const startOfTargetDay = new Date(threeDaysFromNow.setHours(0, 0, 0, 0));
    const endOfTargetDay = new Date(threeDaysFromNow.setHours(23, 59, 59, 999));

    try {
      // 1. חיפוש לקוחות שנגמר להם המנוי בעוד 3 ימים בדיוק
      const upcomingPayments = await User.find({
        nextPaymentDate: { $gte: startOfTargetDay, $lte: endOfTargetDay },
        status: 'Paid'
      });

      upcomingPayments.forEach(user => {
        sendDiscordAlert(
          `⏰ **תזכורת תשלום:** המנוי של **${user.restaurantName}** מסתיים בעוד 3 ימים.\nזה הזמן לשלוח לו הודעה לגבייה!`,
          "תזכורת גבייה",
          15105570, // צבע כתום
          "activity"
        );
      });

      // 2. חיפוש לקוחות שהמנוי שלהם פג תוקף (היום או בעבר) ועדיין רשומים כ-Paid
      const expiredUsers = await User.find({
        nextPaymentDate: { $lt: today },
        status: 'Paid'
      });

      expiredUsers.forEach(user => {
        sendDiscordAlert(
          `🚨 **המנוי פג תוקף!** המנוי של **${user.restaurantName}** נגמר.\nיש לוודא תשלום או להעביר ל-Unpaid ידנית.`,
          "מנוי פג תוקף",
          15158332, // צבע אדום
          "error" // שולח לערוץ השגיאות כי זה דורש טיפול דחוף
        );
      });

    } catch (error) {
      console.error('Error in payment reminder cron:', error);
    }
  });
};