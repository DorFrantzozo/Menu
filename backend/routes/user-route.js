import express from "express";
import {
  loginUser,
  createUser,
  deleteUser,
} from "../controllers/user-controller.js";

const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/signup", createUser);
userRouter.post("/deleteUser", deleteUser);
export default userRouter;
