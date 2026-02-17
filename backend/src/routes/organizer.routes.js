import express from "express";
import { getAllOrganizers } from "../controllers/organizer.controller.js";

const router = express.Router();

// GET /api/organizers
router.get("/", getAllOrganizers);

export default router;
