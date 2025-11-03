import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: [true, "Booking ID is required"],
  },
  payment_method: {
    type: String,
    enum: ["Card", "Cash", "Online"],
    required: [true, "Payment method is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0, "Amount cannot be negative"],
  },
  payment_status: {
    type: String,
    enum: ["Paid", "Pending", "Failed"],
    default: "Pending",
  },
  payment_date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Payment", paymentSchema);
