import express from "express";
import { upload } from "../utils/multer.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { isAuth } from "../utils/jwt.js";
import {
  createUser,
  loginUser,
  verifyEmail,
  resendVerificationEmail,
  SendResetPasswordMail,
  resetPassword
} from "../controllers/auth-controller.js";
import { getCurrentUser } from "../controllers/user-controller.js";

const authRouter = express.Router();

authRouter.post("/signup", authLimiter, upload.single("logo"), createUser);
authRouter.post("/login", authLimiter, loginUser);

authRouter.post("/verifyEmail", verifyEmail);
authRouter.post("/resendVerification", resendVerificationEmail);

authRouter.post("/sendResetPasswordLink", SendResetPasswordMail);
authRouter.post("/resetPassword", resetPassword);

authRouter.get("/me", isAuth, getCurrentUser);

export default authRouter;
