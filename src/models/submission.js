import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      default: null,
    },
    code: { type: String, required: true },
    language: { type: String, required: true, lowercase: true, trim: true },
    codeLength: { type: Number },
    codeHash: { type: String, trim: true },
    runtime: { type: Number, required: true },
    memory: { type: Number, required: true },
    percentileRuntime: { type: Number, default: 0 },
    percentileMemory: { type: Number, default: 0 },
    result: {
      type: String,
      required: true,
      enum: ["AC", "WA", "TLE", "MLE", "CE", "RE", "PENDING"],
      default: "PENDING",
    },
    testcasesPassed: { type: String, default: "0/0" },
    errorMessage: { type: String, default: "" },
    judgeToken: { type: String, default: null },
  },
  {
    timestamps: true,
  },
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
