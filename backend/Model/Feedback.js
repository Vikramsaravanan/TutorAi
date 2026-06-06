import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assessment",
    required: true,
  },
  isCorrect: { type: Boolean, required: true },
  score: { type: Number, default: 0 },
  explanation: { type: String, required: true },
  improvementTip: { type: String, default: "" },
  weakConcept: { type: String, default: "" },
  correctnessAnalysis: { type: String, default: "" },
  timeComplexity: { type: String, default: "" },
  timeComplexityAnalysis: { type: String, default: "" },
  spaceComplexity: { type: String, default: "" },
  spaceComplexityAnalysis: { type: String, default: "" },
  codeQualityNotes: { type: String, default: "" },
  suggestedApproach: { type: String, default: "" },
  rating: {
    type: String,
    enum: ["excellent", "good", "average", "needs_improvement", "poor"],
    default: "average",
  },
  strengths: { type: [String], default: [] },
  weaknesses: { type: [String], default: [] },
  improvementPlan: { type: [mongoose.Schema.Types.Mixed], default: [] },
  motivationalNote: { type: String, default: "" },
  nextTopicSuggestion: { type: String, default: "" },
  roadmap: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Feedback", feedbackSchema);