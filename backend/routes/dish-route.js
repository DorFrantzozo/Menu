import express from "express";
import {
  createDish,
  getDishesByCategory,
  updateDish,
  deleteDish,
  getAllDishesByUserId
} from "../controllers/dish-controller.js";
import { upload } from "../utils/multer.js";
import { isAuth, isUserOrAdmin } from "../utils/jwt.js";

const dishRouter = express.Router();

dishRouter.post(
  "/createDish/:userId",
  isAuth,
  upload.single("img"),    // multer always before isUserOrAdmin for consistency
  isUserOrAdmin,
  createDish
);
dishRouter.get("/getDish/:userId/:category", getDishesByCategory);
dishRouter.put(
  "/updateDish/:userId/:dishId",
  isAuth,
  upload.single("img"),    // multer always before isUserOrAdmin for consistency
  isUserOrAdmin,
  updateDish
);
dishRouter.get("/getAllDishes/:userId", getAllDishesByUserId);
dishRouter.delete("/deleteDish/:userId/:dishId", isAuth, isUserOrAdmin, deleteDish);

export default dishRouter;
