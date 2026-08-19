import User from "../model/user.js";
import Category from "../model/category.js";
import Dish from "../model/dish.js";
import ActivityLog from "../model/activityLog.js";
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
export const  getAdminDashboardStats = async (req, res) => {
  try {
    // We want to fetch all users (except maybe admins, or we can include them)
    const users = await User.find({}).select("-password");

    // Perform an aggregation to get categories and dishes count per user
    const statsProms = users.map(async (user) => {
      const categoriesCount = await Category.countDocuments({ userId: user._id });
      const dishesCount = await Dish.countDocuments({ userId: user._id });
      const scansCount = await ActivityLog.countDocuments({ restaurantId: user._id, type: "qr_scan" });

      return {
        _id: user._id,
        designNumber: user.designNumber,
        plan: user.plan,
        restaurantName: user.restaurantName,
        displayName: user.displayName,
        email: user.email,
        phone: user.phone,
        totalQrScans: Math.max(scansCount, user.totalQrScans || 0),
        qrSlug: user.qrSlug,
        menuSize: categoriesCount + dishesCount,
        lastScan: user.updatedAt, // Using updatedAt as a proxy for last activity/scan if we don't have a dedicated scan log collection yet
        lastLogin: user.lastLogin,
        logo: user.logo,
        isPaid: user.isPaid,
        trialExpiresAt: user.trialExpiresAt,
        // The billing window the admin table reads and the renewal action
        // writes. Omitting these leaves the UI unable to tell "no subscription"
        // apart from "field was never sent".
        nextPaymentDate: user.nextPaymentDate,
        lastBilledDate: user.lastBilledDate,
        subscriptionStatus: user.subscriptionStatus,
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

    // Send the whole user document rather than a handful of fields: a partial
    // user leaves `plan` undefined, and the client then falls back to defaults
    // that look like real data. Billing secrets are stripped on the way out —
    // nothing on the client reads them, and this payload is persisted to the
    // admin's browser storage for the duration of the impersonation.
    const {
      password: _password,
      morningPaymentToken: _paymentToken,
      morningCustomerId: _customerId,
      ...sanitizedUser
    } = targetUser.toObject();

    res.status(200).json({
      message: "Impersonation successful",
      token: impersonationToken,
      user: sanitizedUser
    });

  } catch (error) {
    res.status(500).json({ message: "Error during impersonation", error: error.message });
  }
};

// 3. Update User Plan & Trial
export const updateUserPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { plan, trialEnds } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (plan && plan !== user.plan) {
      user.plan = plan;
      
      if (plan !== "Free") {
        user.isPaid = true;
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        user.nextPaymentDate = nextMonth;
        user.lastBilledDate = new Date();
        user.subscriptionStatus = "active";
      } else {
        // If downgraded to Free
        user.isPaid = false;
        user.subscriptionStatus = "canceled";
      }
    } else if (plan) {
      user.plan = plan;
    }

    if (trialEnds) {
      user.trialExpiresAt = new Date(trialEnds);
    }

    await user.save();

    res.status(200).json({ 
      message: "User updated successfully", 
      plan: user.plan, 
      trialExpiresAt: user.trialExpiresAt,
      isPaid: user.isPaid,
      subscriptionStatus: user.subscriptionStatus
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

/**
 * Add whole months to a date, clamping to the end of the target month.
 *
 * Date.setMonth() overflows instead of clamping: 31 Jan + 1 month lands on
 * 3 Mar, which would quietly move a customer's collection day. Billing dates
 * need 31 Jan + 1 month to be 28/29 Feb.
 */
const addMonths = (date, months) => {
  const result = new Date(date);
  const dayOfMonth = result.getDate();

  result.setDate(1); // park on a day every month has, so the month shift is safe
  result.setMonth(result.getMonth() + months);

  const daysInTargetMonth = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0,
  ).getDate();
  result.setDate(Math.min(dayOfMonth, daysInTargetMonth));

  return result;
};

// 4. Renew a subscription manually
// Payment is collected outside the system, so this records that a customer has
// paid for another period. It deliberately touches only the billing window —
// `plan` and `trialExpiresAt` are managed separately and must not move here.
export const renewSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { months = 1 } = req.body;

    if (!Number.isInteger(months) || months < 1 || months > 12) {
      return res
        .status(400)
        .json({ message: "months must be a whole number between 1 and 12" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.plan === "Free") {
      return res
        .status(400)
        .json({ message: "Free users have no subscription to renew" });
    }

    // Extend from whichever comes later: today, or the end of the period the
    // customer already paid for. Renewing early must not cost them days they
    // bought; renewing late must not hand them a month that has mostly passed.
    const now = new Date();
    const periodStart =
      user.nextPaymentDate && user.nextPaymentDate > now
        ? user.nextPaymentDate
        : now;

    user.nextPaymentDate = addMonths(periodStart, months);
    user.lastBilledDate = now;

    // Nothing charges these customers automatically, so this is the only place
    // a lapsed or cancelled subscription gets reinstated.
    user.isPaid = true;
    user.subscriptionStatus = "active";

    await user.save();

    res.status(200).json({
      message: "Subscription renewed successfully",
      nextPaymentDate: user.nextPaymentDate,
      lastBilledDate: user.lastBilledDate,
      isPaid: user.isPaid,
      subscriptionStatus: user.subscriptionStatus,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error renewing subscription", error: error.message });
  }
};

// 5. Get Urgent Actions (Expiring Trials / Subscriptions)
export const getUrgentActions = async (req, res) => {
  try {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    // Query for users where either trialExpiresAt or nextPaymentDate is between now and nextWeek
    const users = await User.find({
      $or: [
        { trialExpiresAt: { $gte: now, $lte: nextWeek } },
        { nextPaymentDate: { $gte: now, $lte: nextWeek } }
      ]
    }).select("restaurantName email trialExpiresAt nextPaymentDate plan isPaid").lean();

    // Process and sort the items
    let urgentItems = [];

    users.forEach(user => {
      // Placeholder: Adjust 'trialExpiresAt' or 'nextPaymentDate' below based on exact schema logic
      
      // Check Trial Expiration
      if (user.trialExpiresAt && user.trialExpiresAt >= now && user.trialExpiresAt <= nextWeek && !user.isPaid) {
        urgentItems.push({
          _id: user._id,
          restaurantName: user.restaurantName,
          email: user.email,
          type: "trial",
          expirationDate: user.trialExpiresAt,
          daysLeft: Math.ceil((new Date(user.trialExpiresAt) - now) / (1000 * 60 * 60 * 24))
        });
      }

      // Check Paid Subscription Expiration / Billing
      if (user.nextPaymentDate && user.nextPaymentDate >= now && user.nextPaymentDate <= nextWeek && user.isPaid) {
        urgentItems.push({
          _id: user._id,
          restaurantName: user.restaurantName,
          email: user.email,
          type: "subscription",
          expirationDate: user.nextPaymentDate,
          daysLeft: Math.ceil((new Date(user.nextPaymentDate) - now) / (1000 * 60 * 60 * 24))
        });
      }
    });

    // Sort by closest expiration first
    urgentItems.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));

    // Limit to top 50 (instead of 5, to support scrollable list)
    urgentItems = urgentItems.slice(0, 50);

    res.status(200).json(urgentItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching urgent actions", error: error.message });
  }
};
