import express from "express";
import { getAllSyllabus } from "../controllers/syllabus.controller.js";

const router = express.Router();

// GET /api/syllabus
router.get("/", getAllSyllabus);

export default router;
