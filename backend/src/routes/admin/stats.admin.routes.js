import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";
import { getAdminStats } from "../../controllers/admin/stats.admin.controller.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getAdminStats);

export default router;
