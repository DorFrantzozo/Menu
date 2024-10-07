import express from "express";
import {
  createDish,
  getDishesByCategory,
  updateDish,
  deleteDish,
} from "../controllers/dish-controller.js";
import { upload } from "../utils/multer.js";
import { isAuth } from "../utils/jwt.js";

const dishRouter = express.Router();

dishRouter.post(
  "/createDish/:userId",
  isAuth,
  upload.single("img"),
  createDish
);
dishRouter.get("/getDish/:userId/:category", isAuth, getDishesByCategory);
dishRouter.put("/updateDish/:userId/:dishId", isAuth, updateDish);
dishRouter.delete("/deleteDish/:userId/:dishId", isAuth, deleteDish);

export default dishRouter;
