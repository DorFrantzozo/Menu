import express from "express";
import { upload } from "../utils/multer.js"; 
import * as aiController from "../controllers/ai-controller.js";
import { isAuth } from "../utils/jwt.js";

const router = express.Router();

router.post(
  "/scan-menu",
  isAuth,
  upload.single("menuImage"),
  aiController.scanMenu
);

router.post(
  "/save-scanned",
  isAuth,
  aiController.saveScannedMenu
);

export default router;
