import express from "express";
import { trackView, getTopDishes, trackMenuView, getMenuStats } from "../controllers/analyticsController.js";

const router = express.Router();

router.post("/view", trackView);
router.get("/top-dishes", getTopDishes);

router.post("/menu-view", trackMenuView);
router.get("/menu-views", getMenuStats);

export default router;
