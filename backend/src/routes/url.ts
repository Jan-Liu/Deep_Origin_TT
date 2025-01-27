import express from "express";
import { createShortUrl, redirectToOriginalUrl, getUrls, updateSlug} from "../controllers/urlController";
import { authenticate } from "../middleware/auth";
import { rateLimiter } from "../middleware/rateLimiter";

const router = express.Router();

router.get("/", authenticate, getUrls);
router.post("/", authenticate, createShortUrl);
router.get("/:slug", rateLimiter, redirectToOriginalUrl);
router.patch("/:id/slug", rateLimiter, authenticate, updateSlug);

export default router;
