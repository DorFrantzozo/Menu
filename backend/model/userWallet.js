import mongoose from "mongoose";

const userWalletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  dailyLimit: {type: Number, required: true, default: 10},

  usedToday: {type: Number, required: true, default: 0},

  lastUsageDate: {type: Date, default: Date.now},

  //option to buy extra credits
  extraCredits: {type: Number, default: 0},
});

export const UserWallet = mongoose.model("UserWallet", userWalletSchema);
