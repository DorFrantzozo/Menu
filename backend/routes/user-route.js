import express from "express";
import { upload } from "../utils/multer.js";
import { isAuth, isUserOrAdmin } from "../utils/jwt.js";
import { isAdminMiddleware } from "../controllers/admin-controller.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
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
  resetPassword,
  getQrScanCount,
  completeTour,
  findBySlug,
  getCurrentUser,
} from "../controllers/user-controller.js";

const userRouter = express.Router();

userRouter.post("/login", authLimiter, loginUser);
userRouter.post("/signup", authLimiter, upload.single("logo"), createUser);
userRouter.put("/updateUser/:userId", isAuth, upload.single("logo"), isUserOrAdmin, updateUser);
userRouter.get("/find", findRestaurantsByName);
userRouter.get("/slug/:slug", findBySlug);
userRouter.get("/qr-scan-count/:userId", getQrScanCount);
userRouter.get("/me", isAuth, getCurrentUser);
// For deleteUser, the controller expects email/password in body, not a target userId parameter.
// However, adding isAuth ensures the requester is at least logged in.
userRouter.post("/deleteUser", isAuth, deleteUser);
userRouter.get("/getAllUsers", isAuth, isAdminMiddleware, getAllUsers);
userRouter.put("/updateDesign", isAuth, isUserOrAdmin, updateDesignByNumber);
userRouter.put("/updateUserMenuSettings", isAuth, isUserOrAdmin, updateUserMenuSettings);
userRouter.post("/sendResetPasswordLink", SendResetPasswordMail);
userRouter.patch("/complete-tour", isAuth, completeTour);
userRouter.post("/resetPassword", resetPassword);
export default userRouter;
