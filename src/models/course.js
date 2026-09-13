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
    thumbnail: { type: String, required: true, trim: true },
    promoVideoUrl: { type: String, required: true, trim: true },
    benefits: [{ type: String, required: true, trim: true }],
    requirements: [{ type: String, required: true, trim: true }],
    category: { type: String, required: true, trim: true },
    tags: [{ type: String, required: true, trim: true }],
    price: { type: Number, default: null },
    salePrice: { type: Number, default: null },
    stats: {
      learners: { type: Number, default: 0 },
      rating: { type: Number, default: 5.0 },
      reviews: { type: Number, default: 0 },
      lessons: { type: Number, required: true },
      duration: { type: Number, required: true },
    },
    level: {
      type: String,
      required: true,
      enum: ["beginner", "intermediate", "advanced"],
      trim: true,
    },
    isPublished: { type: Boolean, default: false },
    isFree: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
