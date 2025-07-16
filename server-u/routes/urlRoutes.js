import express from "express";
import { shortenUrl, redirectUrl, getStats } from "../controllers/urlController.js";

const router = express.Router();

router.post("/shorturls", shortenUrl);
router.get("/:code", redirectUrl);
router.get("/shorturls/:code", getStats);

export default router;
