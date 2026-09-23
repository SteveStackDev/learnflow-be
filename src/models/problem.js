import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema({
  order: { type: Number },
  title: { type: String, trim: true },
  input: { type: String, default: "" },
  output: { type: String, default: "" },
  explanation: { type: String, default: "" },
});

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expected: { type: String, required: true },
  points: { type: Number, default: 0 },
  isHidden: { type: Boolean, default: false },
});

const subtaskSchema = new mongoose.Schema({
  order: { type: Number },
  name: { type: String, trim: true },
  points: { type: Number, default: 0 },
  constraints: { type: String, trim: true },
  testCases: [testCaseSchema],
});

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    statement: { type: String, required: true, trim: true },
    imageDescription: { type: String, default: "" },
    inputDescription: { type: String, trim: true, default: "" },
    outputDescription: { type: String, trim: true, default: "" },
    constraints: [{ type: String, trim: true }],
    topic: { type: String, trim: true },
    difficulty: { type: String, trim: true },
    points: { type: Number, default: 0 },
    status: { type: String, trim: true },
    timeLimit: { type: Number, default: 1.0 },
    memoryLimit: { type: Number, default: 256 },
    examples: [exampleSchema],
    subtasks: [subtaskSchema],
    createdAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
