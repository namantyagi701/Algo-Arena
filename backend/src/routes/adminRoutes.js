import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { verifyAdmin } from "../middleware/adminMiddleware.js";
import {
  createProblem,
  getAllProblemsAdmin,
  getProblemByIdAdmin,
  updateProblem,
  deleteProblem,
  getDashboardStats,
} from "../controllers/adminController.js";

const router = express.Router();

// All routes: protectRoute → verifyAdmin → controller
router.use(protectRoute, verifyAdmin);

router.get("/stats", getDashboardStats);

router.post("/problems", createProblem);
router.get("/problems", getAllProblemsAdmin);
router.get("/problems/:id", getProblemByIdAdmin);
router.put("/problems/:id", updateProblem);
router.delete("/problems/:id", deleteProblem);

export default router;
