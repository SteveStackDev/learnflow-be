import express from "express";
import { ensureAuth } from "#middlewares/ensureAuth.middleware.js";
import { createComment, getAllComment } from "./comment.controller.js";

const router = express.Router();

// GET
router.get("/message", getAllComment);

// POST
router.post("/message", ensureAuth, createComment);

export default router;
