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
  getUserCourseCurriculum,
  updateCourseProgression,
  saveCourseNote,
  deleteCourseNote,
  saveCourse,
  saveRoadmap,
} from "#modules/user/user.controller.js";
import { validatePassword } from "#modules/user/user.middleware.js";
import notificationService from "#services/notification.service.js";

const router = express.Router();

// GET
router.get("/friend", ensureAuth, getAllFriend);
router.get("/course/progression/:courseId", ensureAuth, getUserCourseCurriculum);
router.get("/verify-email", verifyEmail);

// POST - Auth Required
router.post("/avatar", ensureAuth, upload.single("image"), updateAvatar);
router.post("/friend/add", ensureAuth, addNewFriend);
router.post("/friend/accept", ensureAuth, replyNewFriend);
router.post("/reset-password", ensureAuth, validatePassword, resetPassword);
router.post("/course/save", ensureAuth, saveCourse);
router.post("/course/update-progression", ensureAuth, updateCourseProgression);
router.post("/course/note/save", ensureAuth, saveCourseNote);
router.post("/course/note/delete", ensureAuth, deleteCourseNote);
router.post("/roadmap/save", ensureAuth, saveRoadmap);

// POST - Public / Unauthenticated
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/change-password", validatePassword, changePassword);
router.post("/notification", notificationService.createNotification);

export default router;