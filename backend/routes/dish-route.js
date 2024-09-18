import express from "express";
import {
  createDish,
  getDishesByCategory,
  updateDish,
  deleteDish,
} from "../controllers/dish-controller.js";
import { upload } from "../utils/multer.js";

const dishRouter = express.Router();

dishRouter.post("/createDish/:userId", upload.single("img"), createDish);
dishRouter.get("/getDish/:userId/:category", getDishesByCategory);
dishRouter.put("/updateDish/:userId/:dishId", updateDish);
dishRouter.delete("/deleteDish/:userId/:dishId", deleteDish);

export default dishRouter;
