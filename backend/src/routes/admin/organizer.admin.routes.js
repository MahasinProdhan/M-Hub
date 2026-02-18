import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";
import {
  createOrganizer,
  deleteOrganizer,
} from "../../controllers/admin/organizer.admin.controller.js";

const router = express.Router();

router.post("/organizers", protect, adminOnly, createOrganizer);
router.delete("/organizers/:id", protect, adminOnly, deleteOrganizer);

export default router;
