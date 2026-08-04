import mongoose from "mongoose";

const contestLeaderboardSchema = new mongoose.Schema(
  {
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: { type: Number, default: 0 },
    totalTime: { type: Number, default: 0 },
    rank: { type: Number },
  },
  { timestamps: true },
);

const ContestLeaderboard = mongoose.model(
  "ContestLeaderboard",
  contestLeaderboardSchema,
);

export default ContestLeaderboard;
