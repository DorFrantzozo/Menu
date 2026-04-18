import mongoose, { Schema } from "mongoose";

const DishStatsSchema = new mongoose.Schema({
  dishId: { type: Schema.Types.ObjectId, ref: "Dish", required: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true }, // Normalized to midnight
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
});

// Compound index for fast upserts and queries
DishStatsSchema.index({ dishId: 1, date: 1 }, { unique: true });
// Index for querying by restaurant and date range
DishStatsSchema.index({ restaurantId: 1, date: 1 });


export default mongoose.model("DishStats", DishStatsSchema);
