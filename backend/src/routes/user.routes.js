import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
  getMyProfile,
  getSavedResources,
  saveResource,
  unsaveResource,
  updateMyProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

// Logged-in user profile
router.get("/me", protect, getMyProfile);
router.put("/me", protect, upload.single("avatar"), updateMyProfile);
router.patch("/me", protect, upload.single("avatar"), updateMyProfile);
router.get("/saved", protect, getSavedResources);
router.post("/saved", protect, saveResource);
router.delete("/saved", protect, unsaveResource);

export default router;
