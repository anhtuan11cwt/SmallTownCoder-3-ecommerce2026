import express from "express";
import {
  adminLogin,
  loginUser,
  myProfile,
  verifyUser,
} from "../controllers/User.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/user/login", loginUser);
router.post("/user/verify", verifyUser);
router.post("/user/admin/login", adminLogin);
router.get("/user/me", isAuth, myProfile);

export default router;
