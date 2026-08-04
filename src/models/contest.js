import mongoose from "mongoose";

const contestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, required: true, trim: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true },
    status: {
      type: String,
      enum: ["upcoming", "active", "completed"],
      default: "upcoming",
    },
    password: { type: String, default: null },
    problems: [
      {
        problemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Problem",
          required: true,
        },
        points: { type: Number, required: true, default: 100 },
      },
    ],
    isRatingCalculated: { type: Boolean, default: false },
    stats: {
      registeredCount: { type: Number, default: 0 },
      participantsCount: { type: Number, default: 0 },
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const Contest = mongoose.model("Contest", contestSchema);

export default Contest;
