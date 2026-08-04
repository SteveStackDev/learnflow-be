import express from "express";
import { ensureAuth } from "#middlewares/ensureAuth.middleware.js";
import {
  displayChatArea,
  createConversation,
  createMessage,
  getAllConversation,
  changeConversationAvatar,
} from "#modules/chat/chat.controller.js";
import upload from "#configs/multer.js";

const router = express.Router();

// GET
router.get("/", ensureAuth, displayChatArea);
router.get("/conversation", getAllConversation);

// POST
router.post("/conversation", createConversation);
router.post("/message", upload.array("attachments"), createMessage);
router.post("/avatar", upload.single("image"), changeConversationAvatar);

export default router;
