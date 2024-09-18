import mongoose, { Schema } from "mongoose";

const Category = new mongoose.Schema({
  userId: String,
  name: String,
  img: String,
});

export default mongoose.model("Category", Category);
