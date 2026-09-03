import express from "express";
import authRoute from "#modules/auth/auth.route.js";
import userRoute from "#modules/user/user.route.js";
import chatRoute from "#modules/chat/chat.route.js";
import commentRoute from "#modules/comment/comment.route.js";

const router = express.Router();

// Gom cụm định tuyến
router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/chat", chatRoute);
router.use("/comment", commentRoute);

export default router;
