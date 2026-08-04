import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
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
    content: { type: String, default: "" },
    thumbnail: { type: String, required: true },
    promoVideoUrl: { type: String, default: "" },
    benefits: [{ type: String, trim: true }],
    requirements: [{ type: String, trim: true }],
    category: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    price: { type: Number, default: 0 },
    salePrice: { type: Number, default: 0 },
    stats: {
      learners: { type: Number, default: 0 },
      rating: { type: Number, default: 5.0 },
      reviews: { type: Number, default: 0 },
      lessons: { type: Number, default: 0 },
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    isPublished: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
