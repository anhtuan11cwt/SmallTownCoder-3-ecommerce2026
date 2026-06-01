import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  category: {
    required: true,
    type: String,
  },
  createdAt: {
    default: Date.now,
    type: Date,
  },
  description: {
    required: true,
    type: String,
  },
  images: [
    {
      public_id: String,
      url: String,
    },
  ],
  price: {
    required: true,
    type: Number,
  },
  sold: {
    default: 0,
    type: Number,
  },
  stock: {
    required: true,
    type: Number,
  },
  title: {
    required: true,
    type: String,
  },
});

export const Product = mongoose.model("Product", productSchema);
