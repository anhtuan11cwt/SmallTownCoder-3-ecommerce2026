import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
    unique: true,
  },
  expiresAt: {
    default: () => new Date(Date.now() + 5 * 60 * 1000),
    index: { expires: 0 },
    type: Date,
  },
  otp: {
    required: true,
    type: Number,
  },
});

export const Otp = mongoose.model("otp", otpSchema);
