import cron from "node-cron";
import {processAllProRestaurants} from "../services/ai services/insightService.js";

/**
 * הגדרת הג'וב המתוזמן
 * המבנה '0 3 * * *' אומר:
 * דקה: 0
 * שעה: 3
 * יום בחודש: כל יום
 * חודש: כל חודש
 * יום בשבוע: כל יום
 */
const startNightlyInsightsCron = () => {
  console.log("Cron Job Initialized: Nightly AI Insights at 03:00 AM");

  cron.schedule(
    "0 3 * * *",
    async () => {
      // הגדרת אובייקט זמן ספציפי לישראל עבור הלוגים
      const israelTimeOptions = {
        timeZone: "Asia/Jerusalem",
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };

      const startTime = new Date().toLocaleString("he-IL", israelTimeOptions);

      console.log(
        `[${startTime}] 🤖 Starting scheduled nightly AI insights processing...`,
      );

      try {
        await processAllProRestaurants();

        const endTime = new Date().toLocaleString("he-IL", israelTimeOptions);
        console.log(
          `[${endTime}] ✅ Nightly AI insights completed successfully.`,
        );
      } catch (error) {
        const errorTime = new Date().toLocaleString("he-IL", israelTimeOptions);
        console.error(`[${errorTime}] ❌ Nightly AI insights failed:`, error);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Jerusalem", // מבטיח שה-Cron עצמו יתעורר ב-03:00 של ישראל
    },
  );
};

export default startNightlyInsightsCron;
