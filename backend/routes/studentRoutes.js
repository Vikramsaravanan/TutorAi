import express from "express";
import { chatWithAI } from '../Controllers/studentController.js';
import { bulkUploadStudents, upload } from '../Controllers/csvController.js';
import { updateCPProfiles, getCPStats, getCPStatsForUser } from '../Controllers/cpController.js';
import { generateAssessment, submitAssessment, getAssessmentFeedback, getAssessmentHistory } from '../Controllers/assessmentController.js';
import { protect, requireRole } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post("/chat", protect, requireRole(['student']), chatWithAI);
router.post("/bulk-upload", protect, requireRole(['mentor']), upload.single('file'), bulkUploadStudents);

router.put("/cp-profiles", protect, requireRole(['student']), updateCPProfiles);
router.get("/cp-stats", protect, requireRole(['student']), getCPStats);
router.get("/cp-stats/:userId", protect, getCPStatsForUser);

router.post("/assessment/generate", protect, requireRole(['student']), generateAssessment);
router.post("/assessment/submit/:assessmentId", protect, requireRole(['student']), submitAssessment);
router.get("/assessment/feedback/:assessmentId", protect, getAssessmentFeedback);
router.get("/assessment/history", protect, requireRole(['student']), getAssessmentHistory);

export default router;
