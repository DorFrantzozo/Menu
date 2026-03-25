import User from "../model/user.js";
import Category from "../model/category.js";
import Dish from "../model/dish.js";
import { generateToken } from "../utils/jwt.js";

// Middleware to check Admin role
export const isAdminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
   
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error verifying admin status", error: error.message });
  }
};

// 1. Get Dashboard Stats (Aggregation)
export const getAdminDashboardStats = async (req, res) => {
  try {
    // We want to fetch all users (except maybe admins, or we can include them)
    const users = await User.find({ role: { $ne: "admin" } }).select("-password");

    // Perform an aggregation to get categories and dishes count per user
    const statsProms = users.map(async (user) => {
      const categoriesCount = await Category.countDocuments({ userRef: user._id });
      const dishesCount = await Dish.countDocuments({ userRef: user._id });

      return {
        _id: user._id,
        restaurantName: user.restaurantName,
        displayName: user.displayName,
        email: user.email,
        phone: user.phone,
        totalQrScans: user.totalQrScans || 0,
        qrSlug: user.qrSlug,
        menuSize: categoriesCount + dishesCount,
        lastScan: user.updatedAt, // Using updatedAt as a proxy for last activity/scan if we don't have a dedicated scan log collection yet
        logo: user.logo,
        isPaid: user.isPaid,
        trialExpiresAt: user.trialExpiresAt,
        createdAt: user.createdAt,
      };
    });

    const stats = await Promise.all(statsProms);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
  }
};

// 2. Impersonate User
export const impersonateUser = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    
    // Verify target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new valid JWT for the target user
    const impersonationToken = generateToken(targetUser);

    res.status(200).json({
      message: "Impersonation successful",
      token: impersonationToken,
      user: {
        _id: targetUser._id,
        restaurantName: targetUser.restaurantName,
        email: targetUser.email,
        qrSlug: targetUser.qrSlug
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Error during impersonation", error: error.message });
  }
};
