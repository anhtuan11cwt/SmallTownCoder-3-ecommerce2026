import mongoose from "mongoose";
import Stripe from "stripe";
import { Cart } from "../models/cart.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import sendOrderConfirmation from "../utils/sendOrderConfirmation.js";
import tryCatch from "../utils/tryCatch.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const newOrderCOD = tryCatch(async (req, res) => {
  const { method, phoneNumber, address } = req.body;

  const cart = await Cart.find({ user: req.user._id }).populate(
    "product",
    "title price",
  );

  if (!cart.length) {
    return res.status(400).json({ message: "Giỏ hàng trống" });
  }

  let subTotal = 0;

  const items = cart.map((item) => {
    subTotal += item.product.price * item.quantity;
    return {
      name: item.product.title,
      price: item.product.price,
      product: item.product._id,
      quantity: item.quantity,
    };
  });

  const order = await Order.create({
    address,
    items,
    method,
    phoneNumber,
    subTotal,
    user: req.user._id,
  });

  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (!product) continue;
    if (product.stock < item.quantity) {
      return res.status(400).json({
        message: `Không đủ hàng cho ${product.title}`,
      });
    }
    product.stock -= item.quantity;
    product.sold += item.quantity;
    await product.save();
  }

  await Cart.deleteMany({ user: req.user._id });

  await sendOrderConfirmation(
    req.user.email,
    "Xác nhận đơn hàng",
    order._id,
    items,
    subTotal,
  );

  res.status(201).json({ message: "Đơn hàng đã được tạo thành công", order });
});

export const newOrderOnline = tryCatch(async (req, res) => {
  const { method, phoneNumber, address } = req.body;

  const cart = await Cart.find({ user: req.user._id }).populate("product");

  if (!cart.length) {
    return res.status(400).json({ message: "Giỏ hàng trống" });
  }

  let subTotal = 0;

  const lineItems = cart.map((item) => {
    subTotal += item.product.price * item.quantity;
    return {
      price_data: {
        currency: "vnd",
        product_data: {
          images: [item.product.images[0]?.url],
          name: item.product.title,
        },
        unit_amount: Math.round(item.product.price),
      },
      quantity: item.quantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    cancel_url: `${process.env.FRONTEND_URL}/cart`,
    line_items: lineItems,
    metadata: {
      address,
      method,
      phoneNumber: String(phoneNumber),
      subTotal: String(subTotal),
      userId: String(req.user._id),
    },
    mode: "payment",
    payment_method_types: ["card"],
    success_url: `${process.env.FRONTEND_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
  });

  res.status(200).json({ url: session.url });
});

export const verifyPayment = tryCatch(async (req, res) => {
  const { session_id } = req.query;

  const session = await stripe.checkout.sessions.retrieve(session_id);

  const { userId, phoneNumber, address, subTotal, method } = session.metadata;

  const cart = await Cart.find({ user: userId }).populate("product");

  if (!cart.length) {
    return res.status(400).json({ message: "Giỏ hàng trống" });
  }

  const existingOrder = await Order.findOne({ paymentInfo: session_id });

  if (existingOrder) {
    return res.status(200).json({ order: existingOrder, success: true });
  }

  const items = cart.map((item) => ({
    name: item.product.title,
    price: item.product.price,
    product: item.product._id,
    quantity: item.quantity,
  }));

  const order = await Order.create({
    address,
    items,
    method,
    paidAt: new Date().toISOString(),
    paymentInfo: session_id,
    phoneNumber: Number(phoneNumber),
    subTotal: Number(subTotal),
    user: userId,
  });

  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (!product) continue;
    product.stock -= item.quantity;
    product.sold += item.quantity;
    await product.save();
  }

  await Cart.deleteMany({ user: userId });

  await sendOrderConfirmation(
    req.user.email,
    "Xác nhận đơn hàng",
    order._id,
    items,
    Number(subTotal),
  );

  res
    .status(201)
    .json({ message: "Đơn hàng đã được tạo", order, success: true });
});

export const getAllOrders = tryCatch(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json(orders);
});

export const getAllOrdersAdmin = tryCatch(async (_req, res) => {
  const orders = await Order.find().populate("user").sort({ createdAt: -1 });

  res.status(200).json(orders);
});

export const getMyOrder = tryCatch(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID đơn hàng không hợp lệ" });
  }

  const order = await Order.findById(id)
    .populate("items.product")
    .populate("user");

  if (!order) {
    return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
  }

  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      message: "Bạn không có quyền truy cập đơn hàng này",
    });
  }

  res.status(200).json(order);
});

export const updateStatus = tryCatch(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID đơn hàng không hợp lệ" });
  }

  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
  }

  const { status } = req.body;

  order.status = status;
  await order.save();

  res
    .status(200)
    .json({ message: "Trạng thái đơn hàng đã được cập nhật", order });
});

export const getStats = tryCatch(async (_req, res) => {
  const codOrder = await Order.countDocuments({ method: "COD" });
  const onlineOrder = await Order.countDocuments({ method: "Online" });

  const products = await Product.find();

  const data = products.map((product) => ({
    name: product.title,
    sold: product.sold,
  }));

  res.status(200).json({ codOrder, data, onlineOrder });
});
