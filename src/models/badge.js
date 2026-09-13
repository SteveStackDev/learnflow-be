import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    requirementText: { type: String, required: true, trim: true },
    icon: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["learning", "contest", "community", "special"],
      default: "learning",
      index: true,
    },
    criteriaType: {
      type: String,
      required: true,
      enum: ["problem", "contest", "streak", "community", "course", "custom"],
    },
    targetValue: { type: Number, required: true },
    unitLabel: { type: String, required: true, default: "bài" },
    rarity: {
      type: String,
      enum: ["common", "rare", "epic", "legendary"],
      default: "common",
      index: true,
    },
    stats: {
      earnedCount: { type: Number, default: 0, min: 0 },
    },
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

const Badge = mongoose.model("Badge", badgeSchema);

export default Badge;
