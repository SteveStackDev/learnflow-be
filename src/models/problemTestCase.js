import mongoose from "mongoose";

const problemTestCaseSchema = new mongoose.Schema(
  {
    problemId: { type: mongoose.Schema.Types.Mixed, required: true, index: true },
    subtaskId: { type: mongoose.Schema.Types.Mixed },
    subtaskName: { type: String, trim: true, default: "Subtask 1" },
    order: { type: Number, default: 1 },
    input: { type: String, required: true },
    expected: { type: String, required: true },
    points: { type: Number, default: 0 },
    isHidden: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Index để tìm kiếm test cases theo problemId cực nhanh
problemTestCaseSchema.index({ problemId: 1, order: 1 });

const ProblemTestCase = mongoose.model("ProblemTestCase", problemTestCaseSchema);

export default ProblemTestCase;
