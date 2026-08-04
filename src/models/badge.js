import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, required: true, trim: true },
    thumbnail: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["learning", "contest", "community", "special"],
      default: "learning",
    },
    criteria: {
      type: {
        type: String,
        required: true,
        enum: [
          "solve_problems",
          "contest_rank",
          "daily_streak",
          "complete_courses",
          "custom",
        ],
      },
      value: { type: Number, required: true },
    },
    pointsReward: { type: Number, default: 0 },
    rarity: {
      type: String,
      enum: ["common", "rare", "epic", "legendary"],
      default: "common",
    },
    stats: {
      earnedCount: { type: Number, default: 0 },
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

const Badge = mongoose.model("Badge", badgeSchema);

export default Badge;
