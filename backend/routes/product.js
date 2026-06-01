import express from "express";
import { createProduct, getAllProducts } from "../controllers/product.js";
import { isAuth } from "../middleware/auth.js";
import uploadFiles from "../middleware/multer.js";

const router = express.Router();

router.post("/product/new", isAuth, uploadFiles, createProduct);
router.get("/product/all", getAllProducts);

export default router;
