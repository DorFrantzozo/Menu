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
    required: false,
  },
  description: {
    type: String,
  },

  price: {
    type: Number,
    required: true,
  },
  salePrice: {
    type: Number,
    required: false,
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
  vegi: {
    type: Boolean,
    default: false,
  },
  hide: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Dish", Dish);
