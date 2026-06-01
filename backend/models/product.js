import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  about: {
    required: true,
    type: String,
  },
  category: {
    required: true,
    type: String,
  },
  createdAt: {
    default: Date.now,
    type: Date,
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
