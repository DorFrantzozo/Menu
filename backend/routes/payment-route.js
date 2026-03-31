import express from "express";
import {isAuth} from "../utils/jwt.js";
import {
  startCheckout,
  morningWebhookHandler,
  getUserPaymentHistory,
} from "../controllers/payment-controller.js";

const paymentRouter = express.Router();

// יצירת דף תשלום - דורש התחברות
paymentRouter.post("/checkout", isAuth, startCheckout);

// ה-Webhook ממורנינג - חייב להיות פתוח לכולם (בלי isAuth!)
paymentRouter.post("/morning-webhook", morningWebhookHandler);
paymentRouter.get("/paymentHistory", isAuth, getUserPaymentHistory);
export default paymentRouter;
