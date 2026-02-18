// routes/admin/user.admin.routes.js
import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import {
  getAllUsers,
  updateUserRole,
} from "../../controllers/admin/user.admin.controller.js";

const router = express.Router();

router.get("/users", protect, adminOnly, getAllUsers);
router.patch("/users/:id/role", protect, requireRole("superadmin"), updateUserRole);

export default router;
