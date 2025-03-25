import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // You can set the minimum password length
    },
    restaurantName: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
    designNumber: {
      type: Number,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    trialExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt fields

export default mongoose.model("User", userSchema);
