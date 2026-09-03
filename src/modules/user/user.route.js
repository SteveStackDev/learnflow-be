import express from "express";
import upload from "#configs/multer.js";
import { ensureAuth } from "#middlewares/ensureAuth.middleware.js";
import {
  updateAvatar,
  addNewFriend,
  replyNewFriend,
  getAllFriend,
  forgotPassword,
  verifyOTP,
  changePassword,
  resetPassword,
  verifyEmail,
} from "#modules/user/user.controller.js";
import { validatePassword } from "#modules/user/user.middleware.js";
import notificationService from "#services/notification.service.js";

const router = express.Router();

// GET
router.get("/friend", getAllFriend);
router.get("/verify-email", verifyEmail);

// POST
router.post("/avatar", ensureAuth, upload.single("image"), updateAvatar);
router.post("/friend/add", ensureAuth, addNewFriend);
router.post("/friend/accept", ensureAuth, replyNewFriend);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/change-password", validatePassword, changePassword);
router.post("/reset-password", validatePassword, resetPassword);
router.post("/verify-email", verifyEmail);
router.post("/notification", notificationService.createNotification);

export default router;
