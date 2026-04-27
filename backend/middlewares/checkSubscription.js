export const checkSubscription = (req, res, next) => {
  const user = req.user;

  const now = new Date();

  // 1. בדיקה האם המשתמש בתקופת ניסיון (Trial) פעילה
  // אנחנו בודקים האם תאריך סיום הניסיון גדול מהתאריך של עכשיו
  const isTrialActive =
    user.trialExpiresAt && new Date(user.trialExpiresAt) > now;

  // 2. בדיקה האם המשתמש שילם והמנוי שלו פעיל (Paid)
  const isPaidActive = user.isPaid && user.subscriptionStatus === "active";

  // 3. אם אחד מהתנאים מתקיים - הגישה מאושרת
  if (isTrialActive || isPaidActive) {
    return next();
  }

  // 4. אם הגענו לכאן - הגישה חסומה
  // נשלח הודעה מפורטת לפרונטאנד כדי שידע להציג את הפופ-אפ הנכון
  let reason = "expired";
  if (!user.isPaid && !isTrialActive) reason = "trial_ended";
  if (user.subscriptionStatus === "past_due") reason = "payment_failed";

  return res.status(403).json({
    success: false,
    message: "Access denied. Active subscription or trial required.",
    reason: reason,
  });
};
