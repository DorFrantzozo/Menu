import {
  getAssetByUserId,
  uploadAsset,
} from "../controllers/assets-controller.js";
import { upload } from "../utils/multer.js";
import express from "express";
const assetRouter = express.Router();

assetRouter.post("/uploadAsset/:userId", upload.single("img"), uploadAsset);
assetRouter.get("/getAssets/:userId", getAssetByUserId);

export default assetRouter;
