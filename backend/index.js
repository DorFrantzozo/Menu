import dotenv from "dotenv";
dotenv.config();

import connect from "./connections/connect.js";
import app from "./app.js";
import startNightlyInsightsCron from "./scripts/nightlyInsights.js";
import {initPaymentReminders} from "./utils/paymentReminders.js";
import {testSerchUserPayToken} from "./services/MorningService.js";

startNightlyInsightsCron(); //GROQ AI SERVICE

try {
  await connect();
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    initPaymentReminders();
    console.log("✅DISCORD Payment reminders cron job initialized");
  });
} catch (error) {
  console.error("Failed to connect to the database", error);
}
