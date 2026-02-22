import mongoose from "mongoose";
import { nanoid } from "nanoid";

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
    displayName: {
      type: String,
      required: true,
    },
    phone: {
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
      immutable: true,
    },
    wifiSettings: {
      isEnabled: {
        type: Boolean,
        default: false,
      },
      ssid: {
        type: String,
      },
      wifiPassword: {
        type: String,
      },
    },
    addressSettings: {
      isEnabled: {
        type: Boolean,
        default: false,
      },
      address: {
        type: String,
      },
    },
    role: { type: String, default: "user" },
    qrSlug: {
      type: String,
      unique: true,
      index: true,
    },
    totalQrScans: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt fields

userSchema.pre("save", async function (next) {
  if (this.isNew || !this.qrSlug) {
    let slugExists = true;
    let newSlug = "";

    while (slugExists) {
      // Generate an 8-character long URL-friendly slug
      newSlug = nanoid(8);
      // Check if this slug already exists in the database
      const existingUser = await mongoose.models.User.findOne({ qrSlug: newSlug });
      if (!existingUser) {
        slugExists = false;
      }
    }
    
    this.qrSlug = newSlug;
  }
  next();
});

export default mongoose.model("User", userSchema);
