import express from "express";
import userRouter from "./routes/user-route.js";
import categoryRouter from "./routes/category-route.js";
import dishRouter from "./routes/dish-route.js";
import adminRouter from "./routes/admin-route.js";
import paymentRouter from "./routes/payment-route.js";
import {handleQrRedirect} from "./controllers/user-controller.js";
import cors from "cors";
import authRouter from "./routes/auth-route.js";
import assetRouter from "./routes/asset-route.js";
import analyticsRouter from "./routes/analyticsRoute.js";
import supportRouter from "./routes/supportRoute.js";
import aiRouter from "./routes/ai-route.js";
import {generalLimiter} from "./middlewares/rateLimiter.js";
import {globalErrorHandler} from "./middlewares/errorHandler.js";
import insightRoutes from "./routes/insightRoutes.js";
import marketingRoutes from "./routes/marketingLab-route.js";

const app = express();
app.set("trust proxy", 1);

const getNormalizedOrigin = (url) => {
  if (!url) return "";
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

app.use(
  cors({
    origin: function (origin, callback) {
      // If no origin (like mobile apps or curl requests), allow it
      if (!origin) return callback(null, true);

      // Normalize frontend URL from environment variables
      const frontendUrl = process.env.FRONTEND_URL
        ? getNormalizedOrigin(process.env.FRONTEND_URL)
        : null;
      const fallbackUrl = "https://imenu-il.online";
      const allowedOrigins = [frontendUrl, fallbackUrl].filter(Boolean);

      // --- Validation Logic ---

      // 1. Check for exact match from env or fallback
      const isExactMatch = allowedOrigins.includes(origin);

      // 2. Check if it's our main domain or any subdomain
      const isMainDomainAllowed =
        /^https?:\/\/(?:[a-z0-9-]+\.)?imenu-il\.online$/.test(origin);

      // 3. Check if it's a Vercel deployment (Dynamic Previews)
      const isVercelAllowed = /\.vercel\.app$/.test(origin);

      // 4. Check for local development. Subdomains are allowed because a menu
      // is addressed as <slug>.host, so opening one locally means
      // <slug>.localhost:5173. Browsers resolve every *.localhost name to
      // loopback and never to a real host, so this cannot widen access beyond
      // the developer's own machine.
      const isLocalhost = /^http:\/\/(?:[a-z0-9-]+\.)*localhost(:\d+)?$/.test(
        origin,
      );

      if (
        isExactMatch ||
        isMainDomainAllowed ||
        isVercelAllowed ||
        isLocalhost
      ) {
        return callback(null, true);
      }

      // If we got here, it's blocked
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    optionsSuccessStatus: 200, // For legacy browser support
  }),
);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Unauthenticated, no DB access — for external uptime monitoring.
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

// Apply general rate limiter to all API routes
app.use("/api", generalLimiter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/dish", dishRouter);
app.use("/api/asset", assetRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/support", supportRouter);
app.use("/api/admin", adminRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/ai", aiRouter);
app.use("/api/insights", insightRoutes);
app.use("/api/marketing", marketingRoutes);

// Dynamic QR Redirect Route (no global rate limiter applied here because QR scans can be frequent)
app.get("/go/:slug", handleQrRedirect);

// Global Error Handling Middleware (Must be the last app.use!)
app.use(globalErrorHandler);

export default app;
