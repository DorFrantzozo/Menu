import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["qr_scan", "menu_view", "dish_view"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Index to quickly fetch the last 30 days of data for a specific restaurant
activityLogSchema.index({ restaurantId: 1, timestamp: -1 });

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
