import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    chapterName: {
      type: String,
      required: true,
      trim: true,
      default: "Tổng quan",
    },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, required: true, trim: true },
    thumbnail: { type: String, required: true },
    order: { type: Number, required: true },
    videoUrl: { type: String, default: "" },
    duration: { type: Number, default: 0 },
    resources: [
      {
        title: { type: String, required: true, trim: true },
        url: { type: String, required: true },
      },
    ],
    attachedProblems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],
    stats: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
    },

    isPreview: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;
