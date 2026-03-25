import mongoose from "mongoose";
import DishStats from "../model/dishStats.js";
import Dish from "../model/dish.js";
import MenuStats from "../model/menuStats.js";
import ActivityLog from "../model/activityLog.js";
import cache from "../utils/cache.js";

export const trackView = async (req, res) => {
  try {
    const { dishId } = req.body;
    if (!dishId) {
      return res.status(400).json({ message: "Dish ID is required" });
    }

    // specific dish to get the restaurantId
    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    // Normalize date to midnight (UTC to avoid timezone issues, or local if preferred - sticking to UTC for consistency)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Upsert the stats for today
    await DishStats.findOneAndUpdate(
      {
        dishId: dishId,
        date: today,
      },
      {
        $inc: { views: 1 },
        $setOnInsert: {
          restaurantId: dish.userId, // owner of the dish
        },
      },
      { upsert: true, new: true }
    );

    // Track detailed timestamp log for peak activity reporting (runs in background)
    ActivityLog.create({ restaurantId: dish.userId, type: "dish_view" }).catch(err => {
      console.error("Failed to log detailed dish view activity:", err.message);
    });

    res.status(200).json({ message: "View tracked successfully" });
  } catch (error) {
    console.error("Error tracking view:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTopDishes = async (req, res) => {
  try {
    const { restaurantId, period } = req.query;

    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    // ── Cache check ──
    const cacheKey = `topDishes_${restaurantId}_${period || "all"}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    let dateFilter = {};
    const now = new Date();
    
    // reset to start of today for consistency
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    if (period === "week") {
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      dateFilter = { $gte: lastWeek };
    } else if (period === "month") {
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      dateFilter = { $gte: lastMonth };
    }
    // if period is 'all' or undefined, we don't add a date filter (or filtered from beginning of time)

    const matchStage = {
      restaurantId: new mongoose.Types.ObjectId(restaurantId),
    };

    if (Object.keys(dateFilter).length > 0) {
      matchStage.date = dateFilter;
    }

    const stats = await DishStats.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$dishId",
          totalViews: { $sum: "$views" },
        },
      },
      { $sort: { totalViews: -1 } },
      { $limit: 100 }, // Top 100
      {
        $lookup: {
          from: "dishes", // collection name usually lowercase plural
          localField: "_id",
          foreignField: "_id",
          as: "dishDetails",
        },
      },
      { $unwind: "$dishDetails" },
      {
        $project: {
          _id: 0,
          dishId: "$_id",
          name: "$dishDetails.name",
          image: "$dishDetails.img",
          price: "$dishDetails.price",
          totalViews: 1,
        },
      },
    ]);

    // ── Store in cache (TTL from shared cache instance – 5 min) ──
    cache.set(cacheKey, stats);

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching top dishes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const trackMenuView = async (req, res) => {
  try {
    const { restaurantId } = req.body;

    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    // Normalize date to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Upsert the stats for today
    await MenuStats.findOneAndUpdate(
      {
        restaurantId: restaurantId,
        date: today,
      },
      {
        $inc: { views: 1 },
      },
      { upsert: true, new: true }
    );

    // Track detailed timestamp log for peak activity reporting (runs in background)
    ActivityLog.create({ restaurantId, type: "menu_view" }).catch(err => {
      console.error("Failed to log detailed menu view activity:", err.message);
    });

    res.status(200).json({ message: "Menu view tracked successfully" });
  } catch (error) {
    console.error("Error tracking menu view:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMenuStats = async (req, res) => {
  try {
    const { restaurantId, days = 30 } = req.query;

    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    const stats = await MenuStats.find({
      restaurantId: restaurantId,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    // Format for chart: { date: "DD/MM", views: N }
    const formattedStats = stats.map(stat => ({
      date: new Date(stat.date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' }),
      views: stat.views
    }));

    res.status(200).json(formattedStats);
  } catch (error) {
    console.error("Error fetching menu stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPeakActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // ── Fetch user to get the account creation date ──
    const User = (await import("../model/user.js")).default;
    const user = await User.findById(userId).select("createdAt").lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Dynamic divisor: how many full weeks since account creation (clamped 1–4).
    // This ensures a new account sees accurate data from day one, while the
    // graph stabilises into a true 30-day weekday average after ~4 weeks.
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weeksSinceCreation = (Date.now() - new Date(user.createdAt).getTime()) / msPerWeek;
    const divisor = Math.min(4, Math.max(1, Math.floor(weeksSinceCreation)));

    const matchStage = {
      $match: {
        restaurantId: new mongoose.Types.ObjectId(userId),
        timestamp: { $gte: thirtyDaysAgo }
      }
    };

    const daysAggregation = await ActivityLog.aggregate([
      matchStage,
      {
        $project: {
          dayOfWeek: { $dayOfWeek: { date: "$timestamp", timezone: "Asia/Jerusalem" } }
        }
      },
      {
        $group: {
          _id: "$dayOfWeek",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const hoursAggregation = await ActivityLog.aggregate([
      matchStage,
      {
        $project: {
          hourOfDay: { $hour: { date: "$timestamp", timezone: "Asia/Jerusalem" } }
        }
      },
      {
        $group: {
          _id: "$hourOfDay",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const dayNames = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

    const daysData = Array.from({ length: 7 }, (_, i) => {
      const dayIndex = i + 1; // $dayOfWeek: 1=Sunday … 7=Saturday
      const found = daysAggregation.find(d => d._id === dayIndex);
      const rawCount = found ? found.count : 0;
      return {
        name: dayNames[i],
        // Round to one decimal so small values are still legible
        uv: Math.round((rawCount / divisor) * 10) / 10
      };
    });

    const hoursData = Array.from({ length: 24 }, (_, i) => {
      const found = hoursAggregation.find(h => h._id === i);
      const rawCount = found ? found.count : 0;
      return {
        name: `${i.toString().padStart(2, '0')}:00`,
        uv: Math.round((rawCount / divisor) * 10) / 10
      };
    });

    res.status(200).json({ daysData, hoursData });
  } catch (error) {
    console.error("Error generating peak activity metrics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /api/analytics/clear-my-data
 * Wipes all ActivityLog entries for the authenticated user.
 * Intended for development / QA use only.
 */
export const clearMyData = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await ActivityLog.deleteMany({
      restaurantId: new mongoose.Types.ObjectId(userId),
    });

    res.status(200).json({
      message: `נמחקו ${result.deletedCount} רשומות בהצלחה.`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error clearing activity data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
