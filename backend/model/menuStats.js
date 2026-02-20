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
});

// Compound index for efficient upserts and querying by restaurant+date
menuStatsSchema.index({ restaurantId: 1, date: 1 }, { unique: true });

const MenuStats = mongoose.model("MenuStats", menuStatsSchema);

export default MenuStats;
