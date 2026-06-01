import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  address: {
    required: true,
    type: String,
  },
  phoneNumber: {
    required: true,
    type: Number,
  },
  user: {
    ref: "User",
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
});

export const Address = mongoose.model("Address", addressSchema);
