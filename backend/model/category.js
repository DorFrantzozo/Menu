import mongoose from "mongoose";

const Category = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
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
  locationNumber: {
    type: Number,
    required: true,
  },
  hide: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Category", Category);
