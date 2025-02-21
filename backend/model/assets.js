import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  url: { type: String, required: true }, // Cloudinary URL or other storage
  publicId: { type: String, required: true },
  type: { type: String, enum: ["image", "video", "pdf"] }, // Asset type
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Asset", assetSchema);
