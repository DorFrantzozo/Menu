import User from "../model/user.js";

export const checkSubscription = async (req, res, next) => {
  try {
    const userFromDb = await User.findById(req.user._id);
    if (!userFromDb) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const now = new Date();

    // 1. בדיקה האם המשתמש בתקופת ניסיון (Trial) פעילה
    // אנחנו בודקים האם תאריך סיום הניסיון גדול מהתאריך של עכשיו
    const isTrialActive =
      userFromDb.trialExpiresAt && new Date(userFromDb.trialExpiresAt) > now;

    // 2. בדיקה האם המשתמש שילם והמנוי שלו פעיל (Paid)
    const isPaidActive =
      userFromDb.isPaid && userFromDb.subscriptionStatus === "active";

    // 3. אם אחד מהתנאים מתקיים - הגישה מאושרת
    if (isTrialActive || isPaidActive) {
      return next();
    }

    // 4. אם הגענו לכאן - הגישה חסומה
    // נשלח הודעה מפורטת לפרונטאנד כדי שידע להציג את הפופ-אפ הנכון
    let reason = "expired";
    if (!userFromDb.isPaid && !isTrialActive) reason = "trial_ended";
    if (userFromDb.subscriptionStatus === "past_due") reason = "payment_failed";

    return res.status(403).json({
      success: false,
      message: "Access denied. Active subscription or trial required.",
      reason: reason,
    });
  } catch (error) {
    console.error("Subscription check error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
