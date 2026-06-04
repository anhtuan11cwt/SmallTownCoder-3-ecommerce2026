import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      required: true,
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      default: "user",
      type: String,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
