import express from "express";
import {
  createCategoryByUserId,
  getCategoriesByUserId,
  updateCategoryByUserId,
  deleteCategory,
} from "../controllers/category-controller.js";
import { isAuth } from "../utils/jwt.js";

const categoryRouter = express.Router();

categoryRouter.post("/createCategory", createCategoryByUserId); //TODO:chack is auth
categoryRouter.post("/getCategories", getCategoriesByUserId);
categoryRouter.post("/updateCategory", updateCategoryByUserId);
categoryRouter.delete("/deleteCategory/:userId/:categoryId", deleteCategory);
export default categoryRouter;
