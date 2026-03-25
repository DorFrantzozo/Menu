import express from "express";
import { trackView, getTopDishes, trackMenuView, getMenuStats, getPeakActivity, clearMyData } from "../controllers/analyticsController.js";
import { isAuth } from "../utils/jwt.js";

const router = express.Router();

router.post("/view", trackView);
router.get("/top-dishes", getTopDishes);

router.post("/menu-view", trackMenuView);
router.get("/menu-views", getMenuStats);
router.get("/peak-activity/:userId", isAuth, getPeakActivity);
router.post("/clear-my-data", isAuth, clearMyData);

export default router;
