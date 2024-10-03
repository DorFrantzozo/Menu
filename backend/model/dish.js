import mongoose, { Schema } from "mongoose";

const Dish = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  pregnant: {
    type: Boolean,
    default: false,
  },
  gluten: {
    type: Boolean,
    default: false,
  },
  lactose: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Dish", Dish);
