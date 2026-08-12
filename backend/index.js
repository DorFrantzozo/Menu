import dotenv from "dotenv";
dotenv.config();

import { initSentry, captureError, flushSentry } from "./utils/sentry.js";
initSentry();

import connect from "./connections/connect.js";
import app from "./app.js";
import startNightlyInsightsCron from "./scripts/nightlyInsights.js";
import {initPaymentReminders} from "./utils/paymentReminders.js";
import {testSerchUserPayToken} from "./services/MorningService.js";
import sendDiscordAlert from "./utils/discordAlert.js";

// Both handlers report then exit: Node's default for an unhandled rejection
// is to crash the process the same way an uncaught exception does, and
// registering a handler here takes over that responsibility — so we keep
// the same "unsafe state, let PM2 restart us" behavior rather than silently
// letting the process limp on. flush/alert are awaited so the report has a
// chance to actually leave the process before it exits.
async function reportFatal(err, title) {
  console.error(title, err);
  captureError(err);
  await Promise.allSettled([
    flushSentry(),
    sendDiscordAlert(`**${title}:** ${err.message}`, "🚨 " + title, 15158332, "error"),
  ]);
  process.exit(1); // PM2 autorestart brings the process back up
}

process.on("unhandledRejection", (reason) => {
  reportFatal(reason instanceof Error ? reason : new Error(String(reason)), "Unhandled Rejection");
});

process.on("uncaughtException", (err) => {
  reportFatal(err, "Uncaught Exception");
});

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
