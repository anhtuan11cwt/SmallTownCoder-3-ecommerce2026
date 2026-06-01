import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  cloud_name: process.env.CLOUD_NAME,
});

console.log("Đã cấu hình Cloudinary");

export default cloudinary;
