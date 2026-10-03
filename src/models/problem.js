import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.Mixed },
    order: { type: Number },
    title: { type: String, trim: true },
    input: { type: String, default: "" },
    output: { type: String, default: "" },
    explanation: { type: String, default: "" },
  },
  { _id: false },
);

const testCaseSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.Mixed },
    input: { type: String, required: true },
    expected: { type: String, required: true },
    points: { type: Number, default: 0 },
    isHidden: { type: Boolean, default: false },
  },
  { _id: false },
);

const subtaskSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.Mixed },
    order: { type: Number },
    name: { type: String, trim: true },
    points: { type: Number, default: 0 },
    constraints: { type: String, trim: true },
    testCases: [testCaseSchema],
  },
  { _id: false },
);

const problemSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.Mixed },
    title: { type: String, required: true, trim: true },
    statement: { type: String, required: true, trim: true },
    imageDescription: { type: String, default: "" },
    inputDescription: { type: String, trim: true, default: "" },
    outputDescription: { type: String, trim: true, default: "" },
    constraints: [{ type: String, trim: true }],
    topic: { type: String, trim: true },
    difficulty: { type: String, trim: true },
    points: { type: Number, default: 0 },
    status: { type: String, trim: true, default: "Active" },
    timeLimit: { type: Number, default: 1.0 },
    memoryLimit: { type: Number, default: 256 },
    examples: [exampleSchema],
    subtasks: [subtaskSchema],
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;

