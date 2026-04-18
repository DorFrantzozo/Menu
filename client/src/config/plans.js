const ESSENTIAL_FEATURES = [
  "תפריט דיגיטלי חכם",
  "סריקת תפריט באמצעות AI",
  "QR קוד לסריקה בנייד",
  "עדכונים בזמן אמת",
  "ממשק ניהול עצמי 24/7",
  "סטטיסטיקות וניתוח צפיות",
  "מבחר עיצובים מוכנים",
  "תמיכה בריבוי שפות",
  "סינון מנות על פי אלרגנים ורגישויות",
  "תמיכה טכנית בוואטסאפ"
];

const ADVANCE_ADDONS = [
  " עד 20 סטנדים QR",
  "הזנת תפריט ראשונית (עד 30 פריטים)",
  "עדיפות בתור לתמיכה טכנית",
  "ניתוח ואנליטיקות  לייקים (Likes)"
];

const PRO_ADDONS = [
  "עיצוב מותאם אישית למותג",
  "מודל AI מתקדם (בקרוב)",
  "שיחת אפיון מקצועית",
  "הזנת תפריט ללא הגבלה ע\"י צוות iMenu",
  "ליווי אישי באפיון וחווית משתמש",
  "עד 20 תגי NFC"
];

export const ALL_PLANS = {
  // תוכנית ניסיון - זהה ביכולותיה ל-Essential
  FREE: {
    name: "FREE",
    features: [...ESSENTIAL_FEATURES]
  },
  Essential: {
    name: "Essential",
    features: [...ESSENTIAL_FEATURES]
  },
  Advance: {
    name: "Advance",
    features: [...ESSENTIAL_FEATURES, ...ADVANCE_ADDONS]
  },
  'iMenu PRO': {
    name: "iMenu PRO",
    features: [...ESSENTIAL_FEATURES, ...ADVANCE_ADDONS, ...PRO_ADDONS]
  }
};

export const GLOBAL_FEATURE_LIST = [
  ...ESSENTIAL_FEATURES,
  ...ADVANCE_ADDONS,
  ...PRO_ADDONS
];

// ייצוא המערכים בנפרד עבור עמוד ה-Upgrade
export { ESSENTIAL_FEATURES, ADVANCE_ADDONS, PRO_ADDONS };