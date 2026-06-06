import express from "express";
import { createUser, changePassword, getHierarchyStats } from '../Controllers/userController.js';
import { getDeepHierarchy, getChildrenOf } from '../Controllers/hierarchyController.js';
import { protect } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post("/create", protect, createUser);
router.post("/change-password", protect, changePassword);
router.get("/hierarchy", protect, getHierarchyStats);
router.get("/hierarchy/deep", protect, getDeepHierarchy);
router.get("/hierarchy/children/:userId", protect, getChildrenOf);

export default router;
