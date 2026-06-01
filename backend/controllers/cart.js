import { Cart } from "../models/cart.js";
import { Product } from "../models/product.js";
import tryCatch from "../utils/tryCatch.js";

export const addToCart = tryCatch(async (req, res) => {
  const { product: productId } = req.body;

  const cart = await Cart.findOne({
    product: productId,
    user: req.user._id,
  }).populate("product");

  if (cart) {
    if (cart.product.stock === cart.quantity) {
      return res.status(400).json({ message: "Hết hàng" });
    }

    cart.quantity += 1;
    await cart.save();

    return res.status(200).json({ message: "Đã thêm vào giỏ hàng" });
  }

  const cartProduct = await Product.findById(productId);

  if (cartProduct.stock === 0) {
    return res.status(400).json({ message: "Hết hàng" });
  }

  await Cart.create({
    product: productId,
    quantity: 1,
    user: req.user._id,
  });

  res.status(201).json({ message: "Đã thêm vào giỏ hàng" });
});

export const removeFromCart = tryCatch(async (req, res) => {
  const cart = await Cart.findById(req.params.id);

  await cart.deleteOne();

  res.status(200).json({ message: "Đã xóa khỏi giỏ hàng" });
});

export const updateCart = tryCatch(async (req, res) => {
  const { action } = req.query;
  const { id } = req.body;

  if (action === "inc") {
    const cart = await Cart.findById(id).populate("product");

    if (cart.quantity < cart.product.stock) {
      cart.quantity += 1;
      await cart.save();
    } else {
      return res.status(400).json({ message: "Hết hàng" });
    }
  }

  if (action === "dec") {
    const cart = await Cart.findById(id);

    if (cart.quantity > 1) {
      cart.quantity -= 1;
      await cart.save();
    } else {
      return res.status(400).json({ message: "Bạn chỉ có một sản phẩm" });
    }
  }

  res.status(200).json({ message: "Giỏ hàng đã được cập nhật" });
});

export const fetchCart = tryCatch(async (req, res) => {
  const cart = await Cart.find({ user: req.user._id }).populate("product");

  let subTotal = 0;

  const sumOfQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  cart.forEach((item) => {
    subTotal += item.product.price * item.quantity;
  });

  res.status(200).json({ cart, subTotal, sumOfQuantity });
});
