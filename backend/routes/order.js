import express from "express";
import {
  getAllOrders,
  getAllOrdersAdmin,
  getMyOrder,
  getStats,
  newOrderCOD,
  updateStatus,
} from "../controllers/order.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/order/new/cod", isAuth, newOrderCOD);
router.get("/order/all", isAuth, getAllOrders);
router.get("/order/all/admin", isAuth, getAllOrdersAdmin);
router.get("/order/stats", isAuth, getStats);
router.get("/order/:id", isAuth, getMyOrder);
router.post("/order/status/:id", isAuth, updateStatus);

export default router;
