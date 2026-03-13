import express from "express";
import { isAuth } from "../utils/jwt.js";
import {
  isAdminMiddleware,
  getAdminDashboardStats,
  impersonateUser,
} from "../controllers/admin-controller.js";

const adminRouter = express.Router();

// Apply auth and admin middleware to all routes in this router
adminRouter.use(isAuth, isAdminMiddleware);

// Get User Stats for Dashboard
adminRouter.get("/dashboard-stats", getAdminDashboardStats);

// Impersonate a User
adminRouter.post("/impersonate/:userId", impersonateUser);

export default adminRouter;
