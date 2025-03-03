import express from "express";
import { upload } from "../utils/multer.js";
import {
  loginUser,
  createUser,
  deleteUser,
  updateUser,
  findRestaurantsByname,
  updateDesignByNumber,
  getAllUsers,
} from "../controllers/user-controller.js";

const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/signup", upload.single("logo"), createUser);
userRouter.put("/updateUser/:userId", upload.single("logo"), updateUser);
userRouter.get("/find", findRestaurantsByname);
userRouter.post("/deleteUser", deleteUser);
userRouter.get("/getAllUsers", getAllUsers);
userRouter.post("/updateDesign", updateDesignByNumber);
export default userRouter;
