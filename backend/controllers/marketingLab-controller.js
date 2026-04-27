import * as marketingAiService from "../services/ai services/marketingLabService.js";

export const generateMarketingPost = async (req, res) => {
  try {
    const {platform, format, userText} = req.body;
    const wallet = req.wallet; // הגיע משומר הסף

    const startTime = Date.now();

    // קריאה לשירות הייעודי לשיווק
    const aiResponse = await marketingAiService.generateMarketingPost(
      platform,
      format,
      userText,
    );

    // וידוא של מינימום 8 שניות חשיבה ליצירת אפקט "מעבדה עובדת"
    const elapsedTime = Date.now() - startTime;
    const MINIMUM_DELAY = 10000;
    if (elapsedTime < MINIMUM_DELAY) {
      await new Promise((resolve) =>
        setTimeout(resolve, MINIMUM_DELAY - elapsedTime),
      );
    }

    // חיוב ארנק רק אחרי הצלחה
    wallet.usedToday += 1;
    wallet.lastUsageDate = new Date();
    await wallet.save();

    return res.status(200).json({
      success: true,
      data: aiResponse,
      creditsLeft: wallet.dailyLimit - wallet.usedToday,
    });
  } catch (error) {
    console.error("Marketing generation failed:", error);
    return res
      .status(500)
      .json({success: false, message: "הייתה בעיה במעבדה. נסה שוב."});
  }
};
