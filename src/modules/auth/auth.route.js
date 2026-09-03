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
  validateSignIn,
  validateSignUp,
} from "#modules/auth/auth.middleware.js";

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
    failureRedirect: "/api/v1/auth/",
    failureMessage: "Tiếp tục bằng Google thất bại",
    session: true,
  }),
  authGoogle,
);

// POST
router.post("/sign-up", validateSignUp, signUpPost);
router.post("/sign-in", validateSignIn, localStrategy, SignInPost);
router.post("/sign-out", SignOut);

export default router;
