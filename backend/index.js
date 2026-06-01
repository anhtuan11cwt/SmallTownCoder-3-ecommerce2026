import dotenv from "dotenv";
import express from "express";
// Import routes
import addressRoutes from "./routes/address.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/order.js";
import productRoutes from "./routes/product.js";
import userRoutes from "./routes/User.js";
import connectDB from "./utils/db.js";
import "./config/cloudinary.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Using routes
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);

connectDB();

app.listen(port, () => {
  console.log(`Máy chủ đang chạy tại http://localhost:${port}`);
});
