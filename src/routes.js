import express from "express";
import authRoute from "#modules/auth/auth.route.js";
import userRoute from "#modules/user/user.route.js";
import chatRoute from "#modules/chat/chat.route.js";
import courseRoute from "#modules/course/course.route.js";
import roadmapRoute from "#modules/roadmap/roadmap.route.js";
import badgeRoute from "#modules/badge/badge.route.js";

const router = express.Router();

// Gom cụm định tuyến
router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/chat", chatRoute);
router.use("/course", courseRoute);
router.use("/roadmap", roadmapRoute);
router.use("/badge", badgeRoute);

export default router;
