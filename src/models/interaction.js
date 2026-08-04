import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    targetType: {
      type: String,
      required: true,
      enum: ["Blog", "Lesson", "Problem", "Contest"],
    },
  },
  { timestamps: true },
);

const Interaction = mongoose.model("Interaction", interactionSchema);
export default Interaction;
