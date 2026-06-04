import { User } from "../models/User.js";

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (adminExists) {
      console.log("Tài khoản admin đã tồn tại, bỏ qua seed.");
      return;
    }

    await User.create({
      email: "admin@example.com",
      password: "adminpassword123",
      role: "admin",
    });
    console.log("Tạo tài khoản admin thành công.");
  } catch (error) {
    console.error("Lỗi khi tạo tài khoản admin:", error);
  }
};

export default seedAdmin;
