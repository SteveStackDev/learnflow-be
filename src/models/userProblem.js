import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  label: { type: String, required: true },
  status: { type: String, required: true },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  time: { type: Number, required: true },
  runtime: { type: String, required: true },
  memory: { type: String, required: true },
  input: { type: String, default: "" },
  stdout: { type: String, default: "" },
  stderr: { type: String, default: "" },
  expected: { type: String, default: "" },
  is_hidden: { type: Boolean, default: false },
  subtask_id: { type: Number, required: true },
  subtask_name: { type: String, required: true },
});

const subtaskResultSchema = new mongoose.Schema({
  order: { type: String, required: true },
  title: { type: String, required: true },
  label: { type: String, required: true },
  status: { type: String, required: true },
  earnedScore: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  maxTime: { type: String, required: true },
  maxMemory: { type: String, required: true },
  tests: {
    type: [testResultSchema],
    default: [],
    required: true,
  },
});

const userProblemSchema = new mongoose.Schema(
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
    sourceCode: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    executionTime: {
      type: Number,
      default: null,
    },
    memoryUsed: {
      type: Number,
      default: null,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    maxScore: {
      type: Number,
      required: true,
    },
    passedTests: {
      type: Number,
      required: true,
    },
    totalTests: {
      type: Number,
      required: true,
    },
    testResults: {
      type: [testResultSchema],
      default: [],
      required: true,
    },
    subtasksResult: {
      type: [subtaskResultSchema],
      default: [],
      required: true,
    },
    logs: {
      type: [String],
      default: [],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const UserProblem = mongoose.model("UserProblem", userProblemSchema);

export default UserProblem;
