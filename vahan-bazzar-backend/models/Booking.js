import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    type: { type: String, enum: ["test_ride", "inquiry"], required: true },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true },
    message: { type: String },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    contactInfo: {
      phone: { type: String, required: true },
      email: { type: String, required: true }
    }
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
