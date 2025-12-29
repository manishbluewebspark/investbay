import { Router } from "express";
import {
  seedAdmin,
  login,
  me,
  forgotPassword,
  verifyCode,
  updatePassword
} from "../controllers/authController.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.post("/seed", seedAdmin);
router.post("/login", login);
router.get("/me", authRequired, me);

router.post("/forgot-password", forgotPassword);
router.post("/verify-password", verifyCode);
router.post("/update-password", updatePassword);

export default router;
