import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    avatar: {
      url: { type: String, default: "" },
      urlId: { type: String, default: "" },
    },
    isGroup: { type: Boolean, required: true, default: false },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessageContent: { type: String, default: "" },
    lastMessageAt: { type: Date, default: Date.now },
    lastMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    unreadMessageCounts: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        count: { type: Number, default: 0 },
        lastReadMessageId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Message",
          default: null,
        },
        lastReadAt: { type: Date, default: Date.now },
      },
    ],
    pinnedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
