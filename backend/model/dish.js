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
  nameEn: {
    type: String,
    required: false,
  },

  img: {
    type: String,
    required: false,
  },
  description: {
    type: String,
  },
  descriptionEn: {
    type: String,
    required: false,
  },

  price: {
    type: Number,
    required: false,
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
  likes: {
    type: Number,
    default: 0,
  },
});

export default mongoose.models.Dish || mongoose.model("Dish", Dish);