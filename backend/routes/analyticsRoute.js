import express from "express";
import {
  trackView,
  getTopDishes,
  trackMenuView,
  getMenuStats,
  getPeakActivity,
  clearMyData,
  likeDish,
  trackReviewEvent,
  getReviewStats,
} from "../controllers/analyticsController.js";
import {isAuth} from "../utils/jwt.js";

const router = express.Router();

router.post("/view", trackView);
router.post("/like", likeDish);
router.get("/top-dishes", getTopDishes);

router.post("/menu-view", trackMenuView);
router.get("/menu-views", getMenuStats);
// Public: written by the menu itself, like /menu-view above.
router.post("/review-event", trackReviewEvent);
// Owner-facing figures, so authenticated.
router.get("/review-stats", isAuth, getReviewStats);

router.get("/peak-activity/:userId", isAuth, getPeakActivity);
router.post("/clear-my-data", isAuth, clearMyData);

export default router;
