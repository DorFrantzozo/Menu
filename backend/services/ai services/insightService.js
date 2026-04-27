import User from "../../model/user.js";
import Category from "../../model/category.js";
import Dish from "../../model/dish.js";
import Insight from "../../model/insights.js";
import {runAllRules} from "./aiRules/rulesManager.js";
import {generateInsightText} from "../llmService.js";
import DishStats from "../../model/dishStats.js";
import pLimit from "p-limit";

/**
 * פונקציית הליבה שרצה על כל מסעדות ה-rPRO ומייצרת תובנות
 */
export const processAllProRestaurants = async () => {
  try {
    console.log("Starting nightly AI Insights job...");

    // שליפת כל המשתמשים שמשלמים על PRO (כמו שהגדרת בסכמה)
    const proUsers = await User.find({plan: "iMenu PRO"}).lean();

    // Process up to 3 restaurants concurrently.
    // This prevents the job from running serially (too slow at scale)
    // while still avoiding hammering MongoDB and the Groq API all at once.
    const limit = pLimit(3);
    const tasks = proUsers.map((user) =>
      limit(() => processSingleRestaurant(user._id)),
    );
    const results = await Promise.allSettled(tasks);

    const failed = results.filter((r) => r.status === "rejected").length;
    if (failed > 0) {
      console.warn(
        `⚠️  ${failed} restaurant(s) failed processing during nightly job.`,
      );
    }

    console.log(`Finished processing ${proUsers.length} PRO restaurants.`);
  } catch (error) {
    console.error("Error in processAllProRestaurants:", error);
  }
};

/**
 * ניתוח מסעדה בודדת ובניית אובייקט התפריט עבור המנוע
 */
const processSingleRestaurant = async (userId) => {
  try {
    console.log(`📊 Starting data enrichment for restaurant: ${userId}`);

    // 1. שליפת קטגוריות ומנות פעילות
    const activeCategories = await Category.find({userId, hide: false}).lean();
    const activeDishes = await Dish.find({userId, hide: false}).lean();

    // 2. שליפת סטטיסטיקות התנהגותיות (30 ימים אחרונים)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const dishStatsRaw = await DishStats.find({
      restaurantId: userId,
      date: {$gte: thirtyDaysAgo},
    })
      .select("dishId views likes -_id")
      .lean();

    // 3. יצירת מפה (Map) לגישה מהירה לנתונים לפי dishId
    const statsMap = dishStatsRaw.reduce((acc, stat) => {
      const key = String(stat.dishId);
      if (!acc[key]) acc[key] = {totalViews: 0, totalLikes: 0};

      acc[key].totalViews += stat.views || 0;
      acc[key].totalLikes += stat.likes || 0;
      return acc;
    }, {});

    // 4. מיפוי המנות לתוך הקטגוריות והזרקת הסטטיסטיקות לכל מנה
    const categoriesWithItems = activeCategories.map((category) => {
      return {
        ...category,
        items: activeDishes
          .filter((dish) => String(dish.category) === String(category._id))
          .map((dish) => ({
            ...dish,
            // הזרקת נתוני האמת לתוך אובייקט המנה
            stats: statsMap[String(dish._id)] || {totalViews: 0, totalLikes: 0},
          })),
      };
    });

    // האובייקט המועשר שמוכן לניתוח ה-AI
    const menuData = {
      categories: categoriesWithItems,
    };

    // 5. הרצת מנוע החוקים (כעת ה-Rules Engine רואה גם views וגם likes)
    const findings = runAllRules(menuData);

    if (!findings || findings.length === 0) {
      console.log(`✅ No insights discovered for restaurant ${userId}`);
      return;
    }

    // 6. שמירה או עדכון של התובנות במסד הנתונים
    for (const finding of findings) {
      await handleInsightUpsert(userId, finding);
    }

    console.log(
      `✨ Processed ${findings.length} insights for restaurant ${userId}`,
    );
  } catch (error) {
    console.error(`❌ Error processing restaurant ${userId}:`, error);
  }
};

/**
 * עדכון או יצירת תובנה ב-DB (מנגנון Upsert)
 */
const handleInsightUpsert = async (userId, finding) => {
  try {
    // חיפוש האם כבר קיימת תובנה כזו שעדיין פעילה למסעדה הזו
    const filter = {
      restaurantId: userId,
      ruleId: finding.ruleId,
      isActive: true,
    };

    // === שינוי 2: הלוגיקה החכמה של ה-AI ===
    // נבדוק אם כבר קיימת תובנה כזו פתוחה כדי לחסוך קריאה ל-API של Groq
    const existingInsight = await Insight.findOne(filter);

    let titleToSave;
    let messageToSave;

    if (existingInsight) {
      // התובנה כבר קיימת. נשמור על הטקסט המקורי כדי לא לשגע את הלקוח (ולחסוך טוקנים)
      titleToSave = existingInsight.title;
      messageToSave = existingInsight.message;
    } else {
      // זו תובנה חדשה! נשלח ל-Groq את כל ה-finding (שכולל את ה-metaData ושם הקטגוריה)
      console.log(`Generating new AI text for rule ${finding.ruleId}...`);
      const aiText = await generateInsightText(finding.ruleId, finding);
      titleToSave = aiText.title;
      messageToSave = aiText.message;
    }

    // הנתונים שנעדכן או שניצור
    const updateDoc = {
      $set: {
        restaurantId: userId,
        ruleId: finding.ruleId,
        title: titleToSave,
        message: messageToSave,
        metaData: finding.metaData,
      },
    };

    // פקודת ה-Upsert: אם מצאת תעדכן, אם לא מצאת - תיצור חדש
    const options = {upsert: true, new: true};

    await Insight.findOneAndUpdate(filter, updateDoc, options);
  } catch (error) {
    console.error(`Failed to upsert insight for user ${userId}:`, error);
  }
};
