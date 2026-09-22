import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    duration: { type: Number, required: true },
    description: { type: String, required: true, trim: true },
    thumbnail: { type: String, required: true, trim: true },
    level: {
      type: String,
      required: true,
      enum: ["beginner", "intermediate", "advanced"],
      trim: true,
    },
    tags: [{ type: String, trim: true }],
    labels: [{ type: String, trim: true }],
    roadmap: [
      {
        stepNumber: { type: Number, required: true },
        stepName: { type: String, required: true, trim: true },
        stepDescription: { type: String, required: true, trim: true },
        tags: [{ type: String, trim: true }],
        status: {
          type: String,
          required: true,
          trim: true,
          default: "incompleted",
          enum: ["completed", "incompleted", "in_progress"],
        },
        stepAttachedCourses: [
          { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        ],
      },
    ],
    recommendedCourses: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    ],
    recommendedProblems: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
    ],
  },
  {
    timestamps: true,
  },
);

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

export default Roadmap;
