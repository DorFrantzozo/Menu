import express from "express";
import {
  loginUser,
  createUser,
  deleteUser,
  updateUser,
  findRestaurantsByname,
  updateDesignByNumber,
} from "../controllers/user-controller.js";
import { upload } from "../utils/multer.js";
const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/signup", upload.single("logo"), createUser);
userRouter.put("/updateUser/:userId", upload.single("logo"), updateUser);
userRouter.get("/find", findRestaurantsByname);
userRouter.post("/deleteUser", deleteUser);
userRouter.post("/updateDesign", updateDesignByNumber);
export default userRouter;
