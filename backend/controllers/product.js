import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/product.js";
import bufferGenerator from "../utils/bufferGenerator.js";
import tryCatch from "../utils/tryCatch.js";

export const createProduct = tryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({
      message: "Bạn không phải là admin",
    });
  }

  const { title, about, category, price, stock } = req.body;

  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({
      message: "Không có tệp nào để tải lên",
    });
  }

  const imageUploadPromises = files.map(async (file) => {
    const fileBuffer = bufferGenerator(file);
    const result = await cloudinary.uploader.upload(fileBuffer.content, {
      folder: "SmallTownCoder-3-ecommerce2026/products/images",
    });
    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  });

  const uploadedImages = await Promise.all(imageUploadPromises);

  const product = await Product.create({
    about,
    category,
    images: uploadedImages,
    price,
    stock,
    title,
  });

  res.status(201).json({
    message: "Sản phẩm đã được tạo thành công",
    product,
  });
});

export const getAllProducts = tryCatch(async (req, res) => {
  const { search, category, page, sortByPrice } = req.query;

  const filter = {};

  if (search) {
    filter.title = { $options: "i", $regex: search };
  }

  if (category) {
    filter.category = category;
  }

  const limit = 8;
  const skip = (Number(page) - 1) * limit;

  let sortOptions = { createdAt: -1 };

  if (sortByPrice === "lowToHigh") {
    sortOptions = { price: 1 };
  } else if (sortByPrice === "highToLow") {
    sortOptions = { price: -1 };
  }

  const products = await Product.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const categories = await Product.distinct("category");

  const newProducts = await Product.find().sort({ createdAt: -1 }).limit(4);

  const countProduct = await Product.countDocuments(filter);
  const totalPages = Math.ceil(countProduct / limit);

  res.json({
    categories,
    newProducts,
    products,
    totalPages,
  });
});

export const getSingleProduct = tryCatch(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  }

  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  }).limit(4);

  res.status(200).json({ product, relatedProducts });
});

export const updateProduct = tryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({
      message: "Bạn không phải là admin",
    });
  }

  const { title, about, stock, price, category } = req.body;

  const updateFields = {};

  if (title !== undefined) updateFields.title = title;
  if (about !== undefined) updateFields.about = about;
  if (stock !== undefined) updateFields.stock = stock;
  if (price !== undefined) updateFields.price = price;
  if (category !== undefined) updateFields.category = category;

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updateFields,
    { new: true, runValidators: true },
  );

  if (!updatedProduct) {
    return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  }

  res.status(200).json({
    message: "Sản phẩm đã được cập nhật",
    updatedProduct,
  });
});

export const updateProductImage = tryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({
      message: "Bạn không phải là admin",
    });
  }

  const id = req.params.id;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({
      message: "Không có tệp nào để tải lên",
    });
  }

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  }

  const oldImages = product.images || [];

  for (const img of oldImages) {
    await cloudinary.uploader.destroy(img.public_id);
  }

  const imageUploadPromises = files.map(async (file) => {
    const fileBuffer = bufferGenerator(file);
    const result = await cloudinary.uploader.upload(fileBuffer.content, {
      folder: "SmallTownCoder-3-ecommerce2026/products/images",
    });
    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  });

  const uploadedImages = await Promise.all(imageUploadPromises);

  product.images = uploadedImages;
  await product.save();

  res.status(200).json({
    message: "Hình ảnh đã được cập nhật",
    product,
  });
});
