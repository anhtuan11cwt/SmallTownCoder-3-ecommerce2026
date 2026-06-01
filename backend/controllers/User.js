import jwt from "jsonwebtoken";
import { Otp } from "../models/Otp.js";
import { User } from "../models/User.js";
import sendOtp from "../utils/sendOtp.js";
import tryCatch from "../utils/tryCatch.js";

export const loginUser = tryCatch(async (req, res) => {
  const { email } = req.body;
  const subject = "Ứng dụng E-Commerce";

  const otp = Math.floor(100000 + Math.random() * 900000);

  const existingOtp = await Otp.findOne({ email });
  if (existingOtp) {
    await existingOtp.deleteOne();
  }

  await sendOtp(email, subject, otp);
  await Otp.create({ email, otp });

  res.json({ message: "Đã gửi OTP đến email của bạn" });
});

export const verifyUser = tryCatch(async (req, res) => {
  const { email, otp } = req.body;

  const haveOtp = await Otp.findOne({ email, otp });
  if (!haveOtp) {
    return res.status(400).json({ message: "Sai mã OTP" });
  }

  let user = await User.findOne({ email });

  if (user) {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });
    await haveOtp.deleteOne();
    return res.json({ message: "Đăng nhập thành công", token, user });
  }

  user = await User.create({ email });
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  await haveOtp.deleteOne();
  res.json({ message: "Đăng nhập thành công", token, user });
});
