import express from "express";
import {upload} from "../utils/multer.js";
import {isAuth, isUserOrAdmin} from "../utils/jwt.js";
import {isAdminMiddleware} from "../controllers/admin-controller.js";
import {
  deleteUser,
  updateUser,
  findRestaurantsByName,
  updateDesignByNumber,
  getAllUsers,
  updateUserMenuSettings,
  getQrScanCount,
  completeTour,
  findBySlug,
  getFullMenu,
} from "../controllers/user-controller.js";
import {
  morningWebhookHandler,
  startCheckout,
} from "../controllers/payment-controller.js";

const userRouter = express.Router();


userRouter.put(
  "/updateUser/:userId",
  isAuth,
  upload.single("logo"),
  isUserOrAdmin,
  updateUser,
);
userRouter.get("/find", findRestaurantsByName);
userRouter.get("/slug/:slug", findBySlug);
userRouter.get("/qr-scan-count/:userId", getQrScanCount);

userRouter.get("/getMenu/:userId", getFullMenu);
// For deleteUser, the controller expects email/password in body, not a target userId parameter.
// However, adding isAuth ensures the requester is at least logged in.
userRouter.post("/deleteUser", isAuth, deleteUser);
userRouter.get("/getAllUsers", isAuth, isAdminMiddleware, getAllUsers);
userRouter.put("/updateDesign", isAuth, isUserOrAdmin, updateDesignByNumber);
userRouter.put(
  "/updateUserMenuSettings",
  isAuth,
  isUserOrAdmin,
  updateUserMenuSettings,
);
userRouter.patch("/complete-tour", isAuth, completeTour);



userRouter.post("/checkout", isAuth, startCheckout);
userRouter.post("/morning-webhook", morningWebhookHandler);

export default userRouter;
