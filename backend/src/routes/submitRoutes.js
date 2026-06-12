import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { submitCode } from "../controllers/submitController.js";

const router = express.Router();

router.post("/", protectRoute, submitCode);

export default router;
