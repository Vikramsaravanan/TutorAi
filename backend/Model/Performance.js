import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  topic: { type: String, required: true },
  totalQuestions: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  weakAreas: { type: [String], default: [] },
  lastLevel: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy",
  }
}, { timestamps: true });

export default mongoose.model("Performance", performanceSchema);