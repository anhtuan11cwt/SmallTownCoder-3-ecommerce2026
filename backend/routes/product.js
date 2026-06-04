import express from "express";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  updateProductImage,
} from "../controllers/product.js";
import { isAuth } from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import uploadFiles from "../middleware/multer.js";

const router = express.Router();

router.post("/product/new", isAuth, isAdmin, uploadFiles, createProduct);
router.get("/product/all", getAllProducts);
router.get("/product/:id", getSingleProduct);
router.put("/product/:id", isAuth, isAdmin, updateProduct);
router.post(
  "/product/image/:id",
  isAuth,
  isAdmin,
  uploadFiles,
  updateProductImage,
);

export default router;
