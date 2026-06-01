import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import DataURIParser from "datauri/parser.js";
import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/product.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, "../../frontend/src/assets");

const productsSeedData = [
  {
    category: "Tai nghe nhét tai",
    description:
      "Apple AirPods Pro (Thế hệ 2) với hộp sạc MagSafe (USB-C) mang đến âm thanh xuất sắc, chống ồn chủ động và cảm giác đeo thoải mái. Hỗ trợ sạc nhanh và kết nối mượt mà với các thiết bị Apple.",
    image: [
      "apple_earphone_image.png",
      "product_details_page_apple_earphone_image1.png",
      "product_details_page_apple_earphone_image2.png",
      "product_details_page_apple_earphone_image3.png",
      "product_details_page_apple_earphone_image4.png",
    ],
    name: "Apple AirPods Pro 2nd gen",
    offerPrice: 9999000,
    price: 12499000,
  },
  {
    category: "Tai nghe chụp tai",
    description:
      "Tai nghe Bose QuietComfort 45 được thiết kế để mang đến chất lượng âm thanh đặc biệt và khả năng chống ồn hàng đầu. Với thời lượng pin 24 giờ và thiết kế nhẹ, thoải mái, phù hợp cho mọi môi trường.",
    image: ["bose_headphone_image.png"],
    name: "Bose QuietComfort 45",
    offerPrice: 8249000,
    price: 10749000,
  },
  {
    category: "Điện thoại",
    description:
      "Samsung Galaxy S23 mang đến trải nghiệm di động toàn diện với màn hình AMOLED cao cấp, hình ảnh sống động và mượt mà. Được trang bị công nghệ theo dõi sức khỏe hàng đầu và hiệu năng mạnh mẽ.",
    image: ["samsung_s23phone_image.png"],
    name: "Samsung Galaxy S23",
    offerPrice: 19999000,
    price: 22499000,
  },
  {
    category: "Đồng hồ thông minh",
    description:
      "Đồng hồ thông minh Garmin Venu 2 kết hợp theo dõi sức khỏe nâng cao với thiết kế sang trọng, cung cấp nhiều tính năng như đo nhịp tim, GPS và theo dõi giấc ngủ. Thời lượng pin 24 giờ, lý tưởng cho người yêu thể thao.",
    image: ["venu_watch_image.png"],
    name: "Garmin Venu 2",
    offerPrice: 8749000,
    price: 9999000,
  },
  {
    category: "Phụ kiện",
    description:
      "PlayStation 5 đưa trải nghiệm chơi game lên tầm cao mới với đồ họa ultra-HD, SSD 825GB mạnh mẽ và công nghệ ray tracing cho hình ảnh chân thực. Tải nhanh, chơi mượt, hình ảnh tuyệt đẹp.",
    image: ["playstation_image.png"],
    name: "PlayStation 5",
    offerPrice: 12499000,
    price: 14999000,
  },
  {
    category: "Máy ảnh",
    description:
      "Canon EOS R5 là máy ảnh mirrorless đột phá với cảm biến full-frame 45MP, cho độ phân giải siêu cao và khả năng quay video 8K. Lấy nét tự động tiên tiến và chống rung trong thân máy, lý tưởng cho nhiếp ảnh gia và nhà quay phim.",
    image: ["cannon_camera_image.png"],
    name: "Canon EOS R5",
    offerPrice: 97499000,
    price: 104999000,
  },
  {
    category: "Laptop",
    description:
      "MacBook Pro 16 với chip M2 Pro của Apple mang đến hiệu năng vượt trội với 16GB RAM và SSD 512GB. Màn hình Retina với công nghệ True Tone, lý tưởng cho các chuyên gia sáng tạo.",
    image: ["macbook_image.png"],
    name: "MacBook Pro 16",
    offerPrice: 62499000,
    price: 69999000,
  },
  {
    category: "Tai nghe nhét tai",
    description:
      "Tai nghe không dây Sony WF-1000XM5 mang đến âm thanh sống động với Hi-Res Audio và công nghệ chống ồn tiên tiến. Thiết kế thoải mái, vừa vặn ổn định, phù hợp cho tập thể thao và du lịch.",
    image: ["sony_airbuds_image.png"],
    name: "Sony WF-1000XM5",
    offerPrice: 7499000,
    price: 8749000,
  },
  {
    category: "Phụ kiện",
    description:
      "Máy chiếu Samsung 4K mang đến trải nghiệm điện ảnh sống động với hình ảnh ultra-HD và màu sắc chân thực. Loa tích hợp, hoàn hảo cho xem phim, chơi game hoặc thuyết trình tại nhà.",
    image: ["projector_image.png"],
    name: "Samsung Projector 4K",
    offerPrice: 37499000,
    price: 42499000,
  },
  {
    category: "Laptop",
    description:
      "Laptop gaming ASUS ROG Zephyrus G16 với bộ vi xử lý Intel Core i9 và GPU RTX 4070, mang đến hiệu năng chơi game đỉnh cao. 16GB RAM, SSD 1TB, màn hình 16 inch tuyệt đẹp.",
    image: ["asus_laptop_image.png"],
    name: "ASUS ROG Zephyrus G16",
    offerPrice: 49999000,
    price: 54999000,
  },
];

const uploadImageToCloudinary = async (filename) => {
  try {
    const filePath = path.join(assetsDir, filename);
    const fileBuffer = fs.readFileSync(filePath);
    const extName = path.extname(filename);
    const parser = new DataURIParser();
    const dataUri = parser.format(extName, fileBuffer);
    const result = await cloudinary.uploader.upload(dataUri.content, {
      folder: "SmallTownCoder-3-ecommerce2026/products/images",
    });
    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.error(`Lỗi upload ảnh: ${filename}`, error.message);
    return null;
  }
};

const seedProducts = async () => {
  try {
    const productCount = await Product.countDocuments();

    if (productCount > 0) {
      console.log("Đã có sản phẩm trong DB, bỏ qua seed.");
      return;
    }

    console.log("Đang seed dữ liệu sản phẩm...");

    for (const item of productsSeedData) {
      const imageUploadPromises = item.image.map(uploadImageToCloudinary);
      const uploadedImages = (await Promise.all(imageUploadPromises)).filter(
        Boolean,
      );

      await Product.create({
        about: item.description,
        category: item.category,
        images: uploadedImages,
        price: item.offerPrice || item.price,
        stock: 10,
        title: item.name,
      });

      console.log(`✓ Đã thêm sản phẩm: ${item.name}`);
    }

    console.log("Seed dữ liệu sản phẩm hoàn tất!");
  } catch (error) {
    console.error("Lỗi seed dữ liệu:", error);
  }
};

export default seedProducts;
