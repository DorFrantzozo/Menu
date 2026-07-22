import mongoose from "mongoose";

/**
 * Convert a restaurant name to a URL-friendly slug.
 * Lowercase, replace spaces/underscores with hyphens, strip non-alphanumeric chars.
 */
function slugify(name) {
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-") // spaces & underscores → hyphens
    .replace(/[^a-z0-9-]/g, "") // strip everything except letters, digits, hyphens
    .replace(/-+/g, "-") // collapse consecutive hyphens
    .replace(/^-|-$/g, ""); // trim leading/trailing hyphens
}

const userSchema = new mongoose.Schema(
  {
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6},
    restaurantName: {type: String, required: true},
    displayName: {type: String, required: true},
    phone: {type: String, required: true},
    logo: {type: String},
    plan: {
      type: String,
      enum: ["Free", "Essential", "Advance", "iMenu PRO"],
      default: "Free",
    },
    designNumber: {type: Number, default: 4},

    //payment://///////////////////////////////////
    isPaid: {type: Boolean, default: false},
    trialExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },

    nextPaymentDate: {
      type: Date,
    },

    lastBilledDate: {type: Date},

    morningCustomerId: {type: String},

    morningPaymentToken: {type: String},

    isBillingProcessing: {type: Boolean, default: false},

    subscriptionStatus: {
      type: String, // הוספנו את past_due למקרה של חיוב שכשל
      
      enum: ["active", "canceled", "trial", "past_due"],
      default: "trial",
    },
    lastFourDigits: {type: String},
    //////////////////////////////////////////

    wifiSettings: {
      isEnabled: {type: Boolean, default: false},
      ssid: {type: String},
      wifiPassword: {type: String},
    },
    addressSettings: {
      isEnabled: {type: Boolean, default: false},
      address: {type: String},
    },
    role: {type: String, default: "user"},
    qrSlug: {type: String, unique: true, index: true},

    totalQrScans: {type: Number, default: 0},
    hasCompletedTour: {type: Boolean, default: false},
    lastLogin: {type: Date},
    enableSubCategories: {type: Boolean, default: false},
  },
  {timestamps: true},
);

userSchema.pre("save", async function (next) {
  if (this.isNew || !this.qrSlug) {
    // Build a branded slug from the restaurant name
    let baseSlug = slugify(this.restaurantName || "");

    // Fallback if restaurantName produces an empty slug (e.g. only Hebrew chars)
    if (!baseSlug) {
      baseSlug = `menu-${Date.now()}`;
    }

    // Check uniqueness and append suffix if needed
    let candidate = baseSlug;
    let counter = 1;
    while (await mongoose.models.User.findOne({qrSlug: candidate})) {
      candidate = `${baseSlug}-${counter}`;
      counter++;
    }

    this.qrSlug = candidate;
  }
  next();
});

export default mongoose.model("User", userSchema);
