import mongoose, { Schema } from "mongoose";

const AnalyticsEventSchema = new mongoose.Schema({
  dishId: {
    type: Schema.Types.ObjectId,
    ref: "Dish",
    required: true,
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["dish_like"],
    required: true,
  },
  ipAddress: {
    type: String,
    required: false,
  },
  userAgent: {
    type: String,
    required: false,
  },
  deviceId: {
    type: String,
    required: true, // Frontend will generate a persistent UUID
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Index for high-performance time-series queries
AnalyticsEventSchema.index({ dishId: 1, timestamp: -1 });

// Compound index for anti-spam duplicate checks
AnalyticsEventSchema.index({ dishId: 1, deviceId: 1, ipAddress: 1, timestamp: -1 });

export default mongoose.model("AnalyticsEvent", AnalyticsEventSchema);
