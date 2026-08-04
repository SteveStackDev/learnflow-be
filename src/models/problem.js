import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
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
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    topics: [{ type: String, trim: true }],
    isPublished: { type: Boolean, default: false },
    codeStubs: [
      {
        language: {
          type: String,
          enum: ["javascript", "python", "java", "cpp"],
          required: true,
        },
        stubCode: { type: String, required: true },
      },
    ],
    sampleTestcases: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String, trim: true },
      },
    ],
    stats: {
      points: { type: Number, default: 10 },
      acceptedCount: { type: Number, default: 0 },
      attemptedCount: { type: Number, default: 0 },
      acceptanceRate: { type: Number, default: 100 },
      estimatedTime: { type: Number, default: 15 },
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    solvedUsers: [
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

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
