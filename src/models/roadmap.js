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
    description: { type: String, required: true, trim: true },
    thumbnail: { type: String, required: true, trim: true },
    level: {
      type: String,
      required: true,
      enum: ["beginner", "intermediate", "advanced"],
      trim: true,
    },
    roadmap: [
      {
        stepNumber: { type: Number, required: true },
        stepName: { type: String, required: true, trim: true },
        stepDescription: { type: String, required: true, trim: true },
        stepAttachedCourses: [
          { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        ],
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

export default Roadmap;
