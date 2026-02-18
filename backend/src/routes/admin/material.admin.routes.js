import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";
import {
  createMaterial,
  deleteMaterial,
} from "../../controllers/admin/material.admin.controller.js";

const router = express.Router();

router.post("/materials", protect, adminOnly, createMaterial);
router.delete("/materials/:id", protect, adminOnly, deleteMaterial);

export default router;
