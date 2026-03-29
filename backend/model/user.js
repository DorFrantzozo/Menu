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
    designNumber: {type: Number},
    isPaid: {type: Boolean, default: false},
    trialExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      immutable: true,
    },
    // שדה חדש לניהול הגבייה הידנית שלך
    nextPaymentDate: {
      type: Date,
    },
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
    morningCustomerId: {type: String}, // שדה לשמירת ה-ID של הלקוח ב-Morning
    isPaid: {type: Boolean, default: false},
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
