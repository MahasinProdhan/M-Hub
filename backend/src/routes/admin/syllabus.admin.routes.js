import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";
import { createSyllabus } from "../../controllers/admin/syllabus.admin.controller.js";

const router = express.Router();

router.post("/syllabus", protect, adminOnly, createSyllabus);

export default router;
