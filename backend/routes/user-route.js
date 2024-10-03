import express from "express";
import {
  loginUser,
  createUser,
  deleteUser,
} from "../controllers/user-controller.js";
import { upload } from "../utils/multer.js";
const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/signup", upload.single("logo"), createUser);
userRouter.post("/deleteUser", deleteUser);
export default userRouter;
