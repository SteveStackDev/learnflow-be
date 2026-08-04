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
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: { type: String, required: true, trim: true },
    banner: { type: String, default: "" },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    topics: [
      {
        stepNumber: { type: Number, required: true },
        topicName: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        attachedCourses: [
          { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        ],
        attachedProblems: [
          { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
        ],
      },
    ],
    enrolledUsers: [
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

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

export default Roadmap;
