import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    morningPaymentId: {type: String, required: true}, // ה-ID של התשלום במורנינג
    amount: {type: Number, required: true},
    currency: {type: String, default: "ILS"},
    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "success",
    },
    documentUrl: {type: String}, // לינק להורדת הקבלה
    documentNumber: {type: String}, // מספר הקבלה
    paymentDate: {type: Date, default: Date.now},
    description: {type: String, default: "iMenu Premium Subscription"},
  },
  {timestamps: true},
);

export default mongoose.model("Payment", paymentSchema);
