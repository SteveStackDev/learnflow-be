import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    thumbnail: { type: String, required: true },
    readingTime: { type: Number, default: 1 },
    isFeatured: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    category: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    stats: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ["draft", "pending", "published", "hidden"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  },
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
