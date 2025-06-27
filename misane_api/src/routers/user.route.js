import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  resetPassword,
  generateResetToken,
  updateUserDetails,
  updateUserAvatar,
} from "../controllers/user.controller.js";

const router = Router();

router.use(verifyToken);

router.post("/reset-token", generateResetToken);
router.post("/reset-password", resetPassword);
router.patch("/details", updateUserDetails);
router.patch("/avatar", updateUserAvatar);

export default router;
