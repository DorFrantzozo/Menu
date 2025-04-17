import express from "express";
import { upload } from "../utils/multer.js";
import {
  loginUser,
  createUser,
  deleteUser,
  updateUser,
  findRestaurantsByName,
  updateDesignByNumber,
  getAllUsers,
  updateUserMenuSettings,
  SendResetPasswordMail,
} from "../controllers/user-controller.js";

const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/signup", upload.single("logo"), createUser);
userRouter.put("/updateUser/:userId", upload.single("logo"), updateUser);
userRouter.get("/find", findRestaurantsByName);
userRouter.post("/deleteUser", deleteUser);
userRouter.get("/getAllUsers", getAllUsers);
userRouter.put("/updateDesign", updateDesignByNumber);
userRouter.put("/updateUserMenuSettings", updateUserMenuSettings);
userRouter.post("/sendResetPassword", SendResetPasswordMail);
export default userRouter;
