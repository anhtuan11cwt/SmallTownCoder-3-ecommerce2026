import { Cart } from "../models/cart.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import sendOrderConfirmation from "../utils/sendOrderConfirmation.js";
import tryCatch from "../utils/tryCatch.js";

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

export const getAllOrders = tryCatch(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json(orders);
});

export const getAllOrdersAdmin = tryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Bạn không phải là admin" });
  }

  const orders = await Order.find().populate("user").sort({ createdAt: -1 });

  res.status(200).json(orders);
});

export const getMyOrder = tryCatch(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("items.product")
    .populate("user");

  if (!order) {
    return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
  }

  res.status(200).json(order);
});

export const updateStatus = tryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Bạn không phải là admin" });
  }

  const order = await Order.findById(req.params.id);

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

export const getStats = tryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Bạn không phải là admin" });
  }

  const codOrder = await Order.countDocuments({ method: "COD" });
  const onlineOrder = await Order.countDocuments({ method: "Online" });

  const products = await Product.find();

  const data = products.map((product) => ({
    name: product.title,
    sold: product.sold,
  }));

  res.status(200).json({ codOrder, data, onlineOrder });
});
