import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true, // Makes userId a required field
  },
  name: {
    type: String,
    required: true, // Makes name a required field
  },
  img: {
    type: String,
    required: true,
  },
  locationNumber: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
});

export default mongoose.model("Category", CategorySchema);
