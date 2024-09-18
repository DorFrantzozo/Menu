import mongoose, { Schema } from "mongoose";

const Dish = new mongoose.Schema({
  userId: String,
  name: String,
  img: String,
  description: String,
  price: Number,
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  pregnant: Boolean,
  gluten: Boolean,
  lactose: Boolean,
});

export default mongoose.model("Dish", Dish);
