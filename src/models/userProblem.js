import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema(
  {
    order: { type: Number, default: 1 },
    label: { type: String, default: "Test 1" },
    status: { type: String, default: "WA" },
    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 10 },
    time: { type: Number, default: 0 },
    runtime: { type: String, default: "0ms" },
    memory: { type: String, default: "0KB" },
    input: { type: String, default: "" },
    stdout: { type: String, default: "" },
    stderr: { type: String, default: "" },
    expected: { type: String, default: "" },
    is_hidden: { type: Boolean, default: false },
    subtask_id: { type: mongoose.Schema.Types.Mixed, default: 1 },
    subtask_name: { type: String, default: "Subtask 1" },
  },
  { _id: false },
);

const subtaskResultSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.Mixed, default: "1" },
    title: { type: String, default: "Subtask 1" },
    label: { type: String, default: "Subtask #1" },
    status: { type: String, default: "WA" },
    earnedScore: { type: Number, default: 0 },
    maxScore: { type: Number, default: 100 },
    maxTime: { type: String, default: "0ms" },
    maxMemory: { type: String, default: "0KB" },
    tests: {
      type: [testResultSchema],
      default: [],
    },
  },
  { _id: false },
);

const userProblemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "User",
      required: false,
    },
    problemId: {
      type: mongoose.Schema.Types.Mixed,
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
      default: 0,
    },
    memoryUsed: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    score: {
      type: Number,
      default: 0,
    },
    maxScore: {
      type: Number,
      default: 100,
    },
    passedTests: {
      type: Number,
      default: 0,
    },
    totalTests: {
      type: Number,
      default: 1,
    },
    testResults: {
      type: [testResultSchema],
      default: [],
    },
    subtasksResult: {
      type: [subtaskResultSchema],
      default: [],
    },
    logs: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const UserProblem = mongoose.model("UserProblem", userProblemSchema);

export default UserProblem;

