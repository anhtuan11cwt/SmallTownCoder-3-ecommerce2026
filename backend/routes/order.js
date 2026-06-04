import express from "express";
import {
  getAllOrders,
  getAllOrdersAdmin,
  getMyOrder,
  getStats,
  newOrderCOD,
  newOrderOnline,
  updateStatus,
  verifyPayment,
} from "../controllers/order.js";
import { isAuth } from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/order/new/cod", isAuth, newOrderCOD);
router.post("/order/new/online", isAuth, newOrderOnline);
router.post("/order/verify/payment", isAuth, verifyPayment);
router.get("/order/all", isAuth, getAllOrders);
router.get("/order/all/admin", isAuth, isAdmin, getAllOrdersAdmin);
router.get("/order/stats", isAuth, isAdmin, getStats);
router.get("/order/:id", isAuth, getMyOrder);
router.post("/order/status/:id", isAuth, isAdmin, updateStatus);

export default router;
