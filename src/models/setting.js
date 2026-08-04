import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    privacyAndSecurity: {
      profileVisibility: {
        type: String,
        enum: ["public", "private", "friends"],
        default: "public",
      },
      twoFactorEnabled: { type: Boolean, default: false },
    },

    appearance: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "light",
      },
      language: { type: String, enum: ["vi", "en"], default: "vi" },
    },

    notifications: {
      channels: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        inApp: { type: Boolean, default: true },
      },
      types: {
        marketing: { type: Boolean, default: false },
        contest: { type: Boolean, default: true },
        course: { type: Boolean, default: true },
        problem: { type: Boolean, default: true },
        blog: { type: Boolean, default: true },
        chat: { type: Boolean, default: true },
      },
    },

    editor: {
      theme: { type: String, default: "light" },
      fontSize: { type: Number, default: 16 },
      autoComplete: { type: Boolean, default: true },
      autoSave: { type: Boolean, default: true },
      lineWrapping: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  },
);

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;
