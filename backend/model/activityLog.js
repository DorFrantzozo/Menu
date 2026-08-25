import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: [
      "qr_scan",
      "menu_view",
      "dish_view",
      "review_prompt_shown",
      "review_click",
    ],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Index to quickly fetch the last 30 days of data for a specific restaurant
activityLogSchema.index({ restaurantId: 1, timestamp: -1 });

// TTL: auto-delete raw events after 90 days. Only getPeakActivity reads this
// collection and it never looks back further than 30 days, so 90 leaves a
// wide safety margin. Aggregated history lives in MenuStats/DishStats, which
// have no TTL and are unaffected by this.
activityLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
