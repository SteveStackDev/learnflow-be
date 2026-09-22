import mongoose from "mongoose";

const userLessonSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  status: {
    type: String,
    enum: ["incompleted", "in_progress", "completed"],
    default: "incompleted",
    required: true,
  },
  progression: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
    required: true,
  },
  notes: {
    type: [String],
    default: [],
    required: true,
  },
  lastAccessedAt: {
    type: Date,
    default: null,
  },
});

const userChapterSchema = new mongoose.Schema({
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chapter",
    required: true,
  },
  lessons: {
    type: [userLessonSchema],
    default: [],
    required: true,
  },
});

const userCourseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    progression: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
      required: true,
    },
    curriculum: {
      type: [userChapterSchema],
      default: [],
      required: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    lastAccessedLessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const UserCourse = mongoose.model("UserCourse", userCourseSchema);

export default UserCourse;
