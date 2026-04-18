import cron from 'node-cron';
import { processAllProRestaurants } from '../services/insightService.js';

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

    cron.schedule('0 3 * * *', async () => {
        const startTime = new Date().toLocaleString();
        console.log(`[${startTime}] Starting scheduled nightly AI insights processing...`);
        
        try {
            await processAllProRestaurants();
            console.log(`[${new Date().toLocaleString()}] Nightly AI insights completed successfully.`);
        } catch (error) {
            console.error(`[${new Date().toLocaleString()}] Nightly AI insights failed:`, error);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Jerusalem" // חשוב להגדיר את אזור הזמן של ישראל
    });
};

export default startNightlyInsightsCron;