import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, default: "" },
  topic: { type: String, required: true },
  question: { type: String, required: true },
  problemData: { type: mongoose.Schema.Types.Mixed, default: {} },
  options: { type: [String], default: [] },
  correctAnswer: { type: String, default: "" },
  userAnswer: { type: String, default: null },
  isCorrect: { type: Boolean, default: null },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  status: {
    type: String,
    enum: ["pending", "in_progress", "submitted", "reviewed"],
    default: "pending",
  },
  aiScore: { type: Number, default: 0 },
  aiReview: { type: String, default: "" },
  feedback: { type: String, default: "" },
  submittedAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model("Assessment", assessmentSchema);