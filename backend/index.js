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
import {generalLimiter} from "./middlewares/rateLimiter.js";
import {globalErrorHandler} from "./middlewares/errorHandler.js";
import {initPaymentReminders} from "./utils/paymentReminders.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      // Strict CORS: Allow frontend URL from env or fallback base domain
      const allowedClientUrl =
        process.env.FRONTEND_URL || "https://imenu-il.online";
      if (
        origin === allowedClientUrl ||
        /^https?:\/\/(?:[a-z0-9-]+\.)?imenu-il\.online$/.test(origin)
      ) {
        return callback(null, true);
      }
      // Allow localhost for development
      if (/^http:\/\/localhost(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      callback(null, false);
    },
    credentials: true,
  }),
);

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
