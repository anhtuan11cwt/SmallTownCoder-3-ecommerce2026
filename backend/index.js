import dotenv from "dotenv";
import express from "express";
import connectDB from "./utils/db.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.listen(port, () => {
  console.log(`Máy chủ đang chạy tại http://localhost:${port}`);
});
