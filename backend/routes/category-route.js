import express from "express";
import {
  createCategoryByUserId,
  getCategoriesByUserId,
  updateCategoryByUserId,
  deleteCategory,
  reorderCategories,
} from "../controllers/category-controller.js";
import { upload } from "../utils/multer.js";
import { isAuth } from "../utils/jwt.js";

const categoryRouter = express.Router();

categoryRouter.post(
  "/createCategory",
  upload.single("img"),
  createCategoryByUserId
);
categoryRouter.post("/getCategories", getCategoriesByUserId);
categoryRouter.put(
  "/updateCategory/:userId/:categoryId",
  upload.single("img"),
  updateCategoryByUserId
);
categoryRouter.delete(
  "/deleteCategory/:userId/:categoryId",

  deleteCategory
);
categoryRouter.put("/reorderCategories/:userId", reorderCategories);
export default categoryRouter;
