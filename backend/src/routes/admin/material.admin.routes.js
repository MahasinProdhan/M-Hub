import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";
import { createMaterial } from "../../controllers/admin/material.admin.controller.js";

const router = express.Router();

router.post("/materials", protect, adminOnly, createMaterial);

export default router;
