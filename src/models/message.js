import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    content: {
      type: String,
      trim: true,
      default: "",
    },
    attachments: [
      {
        url: { type: String },
        urlId: { type: String },
        fileType: {
          type: String,
          enum: ["image", "video", "file"],
        },
        fileName: { type: String, trim: true },
      },
    ],
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messageType: {
      type: String,
      enum: ["text", "system"],
      default: "text",
    },
    systemAction: {
      type: String,
      enum: ["conversation_created", "member_joined", "member_left"],
      default: null,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    status: {
      type: String,
      enum: ["sending", "sent", "delivered"],
      default: "sent",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    hiddenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
