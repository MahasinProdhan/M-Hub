import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";
import { createPYQ } from "../../controllers/admin/pyq.admin.controller.js";

const router = express.Router();

// Admin-only: Add PYQ
router.post("/pyqs", protect, adminOnly, createPYQ);

export default router;
