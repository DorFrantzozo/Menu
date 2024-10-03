import express from "express";
import {
  createCategoryByUserId,
  getCategoriesByUserId,
  updateCategoryByUserId,
  deleteCategory,
} from "../controllers/category-controller.js";
import { upload } from "../utils/multer.js";

const categoryRouter = express.Router();

categoryRouter.post(
  "/createCategory",
  upload.single("img"),
  createCategoryByUserId
); //TODO:chack is auth
categoryRouter.post("/getCategories", getCategoriesByUserId);
categoryRouter.post("/updateCategory", updateCategoryByUserId);
categoryRouter.delete("/deleteCategory/:userId/:categoryId", deleteCategory);
export default categoryRouter;
