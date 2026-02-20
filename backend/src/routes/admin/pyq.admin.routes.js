import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";
import { uploadPdfSingle } from "../../middlewares/pdfUpload.middleware.js";
import {
  createPYQ,
  updatePYQ,
  deletePYQ,
} from "../../controllers/admin/pyq.admin.controller.js";

const router = express.Router();

// Admin-only: Add PYQ
router.post("/pyqs", protect, adminOnly, uploadPdfSingle("pdfFile"), createPYQ);

// Admin-only: Delete PYQ
router.delete("/pyqs/:id", protect, adminOnly, deletePYQ);
router.patch("/pyqs/:id", protect, adminOnly, updatePYQ);

export default router;
