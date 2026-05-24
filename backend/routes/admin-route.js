import express from "express";
import { isAuth } from "../utils/jwt.js";
import {
  isAdminMiddleware,
  getAdminDashboardStats,
  impersonateUser,
  updateUserPlan,
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

export default adminRouter;
