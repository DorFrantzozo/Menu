import express from "express";
import {generateMarketingPost} from "../controllers/marketingLab-controller.js";
import {verifyAiCredits} from "../middlewares/creditCheck.js"; // אם הטמעת את שומר הסף
import {isAuth} from "../utils/jwt.js";

const router = express.Router();

// הנתיב המלא כאן יהיה /api/marketing/generate בגלל ה-app.use שעשינו למעלה
router.post("/generate", isAuth, verifyAiCredits, generateMarketingPost);

export default router;
