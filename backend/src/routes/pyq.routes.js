import express from "express";
import { getAllPYQs } from "../controllers/pyq.controller.js";

const router = express.Router();

// GET /api/pyqs
router.get("/", getAllPYQs);

export default router;
