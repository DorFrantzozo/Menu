import express from "express";
import connect from "./connections/connect.js";
import userRouter from "./routes/user-route.js";
import categoryRouter from "./routes/category-route.js";
import dishRouter from "./routes/dish-route.js";
import adminRouter from "./routes/admin-route.js";
import paymentRouter from "./routes/payment-route.js";
import {handleQrRedirect} from "./controllers/user-controller.js";
import cors from "cors";

import dotenv from "dotenv";
import assetRouter from "./routes/asset-route.js";
import analyticsRouter from "./routes/analyticsRoute.js";
import supportRouter from "./routes/supportRoute.js";
import aiRouter from "./routes/ai-route.js";
import {generalLimiter} from "./middlewares/rateLimiter.js";
import {globalErrorHandler} from "./middlewares/errorHandler.js";
import {initPaymentReminders} from "./utils/paymentReminders.js";
import startNightlyInsightsCron from "./scripts/nightlyInsights.js";
import insightRoutes from './routes/insightRoutes.js';

dotenv.config();


const app = express();
app.set('trust proxy', 1);

const getNormalizedOrigin = (url) => {
  if (!url) return "";
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

app.use(
  cors({
    origin: function (origin, callback) {
      // If no origin (like mobile apps or curl requests), allow it
      if (!origin) return callback(null, true);

      const frontendUrl = getNormalizedOrigin(process.env.FRONTEND_URL);
      const fallbackUrl = "https://imenu-il.online";
      
      const allowedOrigins = [frontendUrl, fallbackUrl].filter(Boolean);
      
      // Check if the origin matches our main domain or any subdomain of it
      const isDomainAllowed = /^https?:\/\/(?:[a-z0-9-]+\.)?imenu-il\.online$/.test(origin);
      const isExactMatch = allowedOrigins.includes(origin);

      if (isExactMatch || isDomainAllowed || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    optionsSuccessStatus: 200, // For legacy browser support
  }),
);

startNightlyInsightsCron();//GROQ AI SERVICE
app.use(express.json());

// Apply general rate limiter to all API routes
app.use("/api", generalLimiter);
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/dish", dishRouter);
app.use("/api/asset", assetRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/support", supportRouter);
app.use("/api/admin", adminRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/ai", aiRouter);
app.use('/api/insights', insightRoutes);

// Dynamic QR Redirect Route (no global rate limiter applied here because QR scans can be frequent)
app.get("/go/:slug", handleQrRedirect);

// Global Error Handling Middleware (Must be the last app.use!)
app.use(globalErrorHandler);


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
