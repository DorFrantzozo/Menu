import express from "express";
import {
  createDish,
  getDishesByCategory,
  updateDish,
  deleteDish,
  getAllDishesByUserId,
  reorderDishes,
  migrateDishLocations,
} from "../controllers/dish-controller.js";
import {upload} from "../utils/multer.js";
import {isAuth, isUserOrAdmin, isAdmin} from "../utils/jwt.js";
import {checkSubscription} from "../middlewares/checkSubscription.js";

const dishRouter = express.Router();

dishRouter.post(
  "/createDish/:userId",
  isAuth,
  upload.single("img"), // multer always before isUserOrAdmin for consistency
  isUserOrAdmin,
  checkSubscription,
  createDish,
);
dishRouter.get("/getDish/:userId/:category", getDishesByCategory);
dishRouter.put(
  "/updateDish/:userId/:dishId",
  isAuth,
  upload.single("img"), // multer always before isUserOrAdmin for consistency
  isUserOrAdmin,
  checkSubscription,
  updateDish,
);
dishRouter.get("/getAllDishes/:userId", getAllDishesByUserId);
dishRouter.delete(
  "/deleteDish/:userId/:dishId",
  isAuth,
  isUserOrAdmin,
  checkSubscription,
  deleteDish,
);

dishRouter.put(
  "/reorderDishes/:userId",
  isAuth,
  isUserOrAdmin,
  reorderDishes,
);

dishRouter.post(
  "/migrate-locations",
  isAuth,
  isAdmin,
  migrateDishLocations,
);

export default dishRouter;
