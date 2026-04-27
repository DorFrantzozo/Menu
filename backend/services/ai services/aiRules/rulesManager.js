// בהנחה שהוספת את הפונקציות של המנות לאותו קובץ categoryRuls.js
import {
  checkCategoryOverLoad,
  checkThinCategories,
  checkDishMissingImage,
  checkDishPoorDescription,
  checkHighViewsLowConversion,
  checkHiddenGem,
  checkGhostDish,
  checkInvisibleSale,
  checkMissingImagesSummary,
  checkPriceAnchoring,
  checkDryDescriptionsSummary,
  checkStaleCategory,
} from "./categoryRuls.js";

/**
 * מריץ את כל הבדיקות על נתוני המסעדה
 * @param {Object} data - אובייקט המכיל את הקטגוריות והמנות
 */
export const runAllRules = (data) => {
  const findings = [
    ...checkCategoryOverLoad(data.categories),
    ...checkThinCategories(data.categories),
    ...checkDishMissingImage(data.categories),
    ...checkDishPoorDescription(data.categories),
    ...checkHighViewsLowConversion(data.categories),
    ...checkHiddenGem(data.categories),
    ...checkGhostDish(data.categories),
    ...checkInvisibleSale(data.categories),
    ...checkMissingImagesSummary(data.categories),
    ...checkPriceAnchoring(data.categories),
    ...checkDryDescriptionsSummary(data.categories),
    ...checkStaleCategory(data.categories),
  ];

  // מנגנון הגנה: אם מצאנו 20 בעיות בתפריט, לא נציף את הלקוח (ואת ה-API של Groq).
  // אנחנו נחזיר רק את ה-5 הראשונות בכל פעם.
  // מחר כשהוא יתקן אותן, המערכת תמצא את הבאות בתור.
  return findings.slice(0, 5);
};
