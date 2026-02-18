// routes/admin/user.admin.routes.js
import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";
import { getAllUsers } from "../../controllers/admin/user.admin.controller.js";

const router = express.Router();

router.get("/users", protect, adminOnly, getAllUsers);

export default router;
