import express from "express";
import {
  createCategoryByUserId,
  getCategoriesByUserId,
  updateCategoryByUserId,
  deleteCategory,
  reorderCategories,
} from "../controllers/category-controller.js";
import { upload } from "../utils/multer.js";
import { isAuth, isUserOrAdmin } from "../utils/jwt.js";

const categoryRouter = express.Router();

categoryRouter.post(
  "/createCategory",
  isAuth,
  upload.single("img"),  // ← multer חייב לרוץ לפני isUserOrAdmin כדי לפענח FormData
  isUserOrAdmin,
  createCategoryByUserId
);
categoryRouter.get("/getCategories/:userId", getCategoriesByUserId);
categoryRouter.put(
  "/updateCategory/:userId/:categoryId",
  isAuth,
  upload.single("img"),  // ← גם כאן
  isUserOrAdmin,
  updateCategoryByUserId
);
categoryRouter.delete(
  "/deleteCategory/:userId/:categoryId",
  isAuth, 
  isUserOrAdmin,
  deleteCategory
);
categoryRouter.put("/reorderCategories/:userId", isAuth, isUserOrAdmin, reorderCategories);
export default categoryRouter;
