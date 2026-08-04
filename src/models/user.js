import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    googleId: {
      type: String,
      trim: true,
      default: "",
    },
    githubId: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    avatar: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/learnflow/image/upload/v1784343163/LearnFlow/avatars/ofppjnju83x47exdahtc.jpg",
      },
      urlId: {
        type: String,
        default: "LearnFlow/avatars/ofppjnju83x47exdahtc",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    accountStatus: {
      type: String,
      enum: ["inactive", "active", "blocked", "banned"],
      default: "inactive",
    },
    interactionStatus: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    experiencePoints: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    dailyStreak: { type: Number, default: 0 },
    lastActiveAt: { type: Date, default: Date.now },
    pomodoroStreak: { type: Number, default: 0 },
    hoursFocused: { type: Number, default: 0 },
    problems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    contests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contest",
      },
    ],
    roadmaps: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Roadmap",
      },
    ],
    todos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Todo",
      },
    ],
    friends: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "declined"],
          default: "pending",
        },
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        receiverId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    badges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Badge",
      },
    ],
    accessToken: {
      type: String,
      trim: true,
      default: "",
    },
    refreshToken: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
