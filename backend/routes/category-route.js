import express from "express";
import {
  createCategoryByUserId,
  getCategoriesByUserId,
  updateCategoryByUserId,
  deleteCategory,
  reorderCategories,
} from "../controllers/category-controller.js";
import {upload} from "../utils/multer.js";
import {isAuth, isUserOrAdmin} from "../utils/jwt.js";
import {checkSubscription} from "../middlewares/checkSubscription.js";

const categoryRouter = express.Router();

categoryRouter.post(
  "/createCategory",
  isAuth,
  upload.single("img"), // ← multer חייב לרוץ לפני isUserOrAdmin כדי לפענח FormData
  isUserOrAdmin,
  checkSubscription,
  createCategoryByUserId,
);
categoryRouter.get("/getCategories/:userId", getCategoriesByUserId);
categoryRouter.put(
  "/updateCategory/:userId/:categoryId",
  isAuth,
  upload.single("img"), // ← גם כאן
  isUserOrAdmin,
  checkSubscription,
  updateCategoryByUserId,
);
categoryRouter.delete(
  "/deleteCategory/:userId/:categoryId",
  isAuth,
  isUserOrAdmin,
  checkSubscription,
  deleteCategory,
);
categoryRouter.put(
  "/reorderCategories/:userId",
  isAuth,
  isUserOrAdmin,
  checkSubscription,
  reorderCategories,
);
export default categoryRouter;
