import "dotenv/config";
import cors from "cors";
import express from "express";
// Import routes
import addressRoutes from "./routes/address.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/order.js";
import productRoutes from "./routes/product.js";
import userRoutes from "./routes/User.js";
import seedAdmin from "./seeds/seedAdmin.js";
import seedProducts from "./seeds/seedProducts.js";
import connectDB from "./utils/db.js";
import "./config/cloudinary.js";

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Using routes
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);

connectDB().then(() => {
  seedProducts();
  seedAdmin();
});

app.listen(port, () => {
  console.log(`Máy chủ đang chạy tại http://localhost:${port}`);
});
