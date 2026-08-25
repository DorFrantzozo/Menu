import mongoose from "mongoose";

const menuStatsSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  // Review prompt funnel. Kept here rather than in ActivityLog because that
  // collection expires after 90 days, and "reviews we sent you this month"
  // needs to stay true for longer than that.
  reviewPromptShown: {
    type: Number,
    default: 0,
  },
  reviewClicks: {
    type: Number,
    default: 0,
  },
});

// Compound index for efficient upserts and querying by restaurant+date
menuStatsSchema.index({ restaurantId: 1, date: 1 }, { unique: true });

const MenuStats = mongoose.model("MenuStats", menuStatsSchema);

export default MenuStats;
