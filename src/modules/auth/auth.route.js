import express from "express";
import passport from "passport";
import {
  signInGet,
  signUpPost,
  signUpGet,
  SignInPost,
  homeGet,
  SignOut,
  authGoogle,
  authGithub,
} from "#modules/auth/auth.controller.js";
import { ensureAuth } from "#middlewares/ensureAuth.middleware.js";
import {
  localStrategySignIn,
  localStrategySignUp,
  validateAuth,
  validateAuthSignIn,
} from "#modules/auth/auth.middleware.js";
import mongoose from "mongoose";
import User from "#models/user.js";

const router = express.Router();

// GET
router.get("/", ensureAuth, homeGet);
router.get("/sign-up", signUpGet);
router.get("/sign-in", signInGet);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
    session: true,
  }),
);
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    accessType: "offline",
    prompt: "consent",
    session: true,
  }),
);
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api/v1/auth/",
    failureMessage: "Tiếp tục bằng Github thất bại",
    session: true,
  }),
  authGithub,
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "https://fyset-fe.onrender.com",
    successMessage: "Tiếp tục bằng Google thành công",
    failureRedirect: "https://fyset-fe.onrender.com/signin",
    failureMessage: "Tiếp tục bằng Google thất bại",
    session: true,
  }),
  authGoogle,
);

router.get(
  "/get-me",
  (req, res, next) => {
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      "Surrogate-Control": "no-store",
    });
    next();
  },
  ensureAuth,
  async (req, res) => {
    try {
      const userId = req.session?.passport?.user?.id || req.user?._id || req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const user = await User.findById(new mongoose.Types.ObjectId(userId));

      if (!user) {
        return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
      }

      // Tính toán và cập nhật Daily Streak thực tế
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      let currentStreak = user.dailyStreak || 0;
      let shouldUpdateStreak = false;

      if (!user.lastActiveAt) {
        currentStreak = 1;
        shouldUpdateStreak = true;
      } else {
        const lastActive = new Date(user.lastActiveAt);
        const lastActiveDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
        const diffTime = today.getTime() - lastActiveDay.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          if (currentStreak === 0) {
            currentStreak = 1;
            shouldUpdateStreak = true;
          }
        } else if (diffDays === 1) {
          currentStreak += 1;
          shouldUpdateStreak = true;
        } else if (diffDays > 1) {
          currentStreak = 1;
          shouldUpdateStreak = true;
        }
      }

      if (shouldUpdateStreak) {
        user.dailyStreak = currentStreak;
        user.lastActiveAt = now;
        await User.updateOne(
          { _id: user._id },
          { $set: { dailyStreak: currentStreak, lastActiveAt: now } }
        );
      }

      const avatarUrl =
        typeof user.avatar === "object"
          ? user.avatar?.url
          : user.avatar || "";

      const data = {
        _id: user._id,
        id: user._id,
        username: user.username,
        name: user.username,
        email: user.email,
        role: user.role,
        avatar: avatarUrl,
        dailyStreak: currentStreak || 1,
        experiencePoints: user.experiencePoints || 0,
        rating: user.rating || 0,
        isSocialLogin: Boolean(user.googleId || user.githubId),
        createdAt: user.createdAt,
      };

      return res.status(200).json({
        success: true,
        message: "Lấy thông tin tài khoản thành công",
        data: data,
      });
    } catch (error) {
      console.error("Lỗi get-me:", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
);

// POST
router.post("/sign-up", validateAuth, localStrategySignUp, signUpPost);
router.post("/sign-in", validateAuthSignIn, localStrategySignIn, SignInPost);
router.post("/sign-out", SignOut);

export default router;
