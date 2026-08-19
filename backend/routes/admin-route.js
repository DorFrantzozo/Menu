import express from "express";
import { isAuth } from "../utils/jwt.js";
import {
  isAdminMiddleware,
  getAdminDashboardStats,
  impersonateUser,
  updateUserPlan,
  renewSubscription,
  getUrgentActions,
} from "../controllers/admin-controller.js";

const adminRouter = express.Router();

// Apply auth and admin middleware to all routes in this router
adminRouter.use(isAuth, isAdminMiddleware);

// Get User Stats for Dashboard
adminRouter.get("/dashboard-stats", getAdminDashboardStats);

// Get Urgent Actions
adminRouter.get("/urgent-actions", getUrgentActions);

// Impersonate a User
adminRouter.post("/impersonate/:userId", impersonateUser);

// Update User Plan & Trial
adminRouter.put("/users/:id", updateUserPlan);

// Renew a subscription manually (payment is collected outside the system)
adminRouter.patch("/users/:id/renew-subscription", renewSubscription);

export default adminRouter;
