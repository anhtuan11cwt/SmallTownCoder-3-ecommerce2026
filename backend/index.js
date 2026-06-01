import dotenv from "dotenv";
import express from "express";
// Import routes
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

connectDB();

app.listen(port, () => {
  console.log(`Máy chủ đang chạy tại http://localhost:${port}`);
});
