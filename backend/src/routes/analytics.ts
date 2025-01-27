import express from "express";
import { getAnalytics } from "../controllers/analyticsController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.get("/:slug", authenticate, getAnalytics);

export default router;
