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
  localStrategy,
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
    successRedirect: "http://localhost:5173",
    successMessage: "Tiếp tục bằng Google thành công",
    failureRedirect: "/api/v1/auth/",
    failureMessage: "Tiếp tục bằng Google thất bại",
    session: true,
  }),
  authGoogle,
);

router.get("/get-me", ensureAuth, async (req, res) => {
  const user = await User.findById(
    new mongoose.Types.ObjectId(req.session.passport.user.id),
  );

  if (user) {
    const data = {
      name: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar.url,
    };

    return res.send({
      message: "Tiếp tục bằng Google thành công",
      data: data,
    });
  }
});

// POST
router.post("/sign-up", validateAuth, localStrategy, signUpPost);
router.post("/sign-in", validateAuthSignIn, localStrategy, SignInPost);
router.post("/sign-out", SignOut);

export default router;
