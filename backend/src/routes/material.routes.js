import express from "express";
import { getAllMaterials } from "../controllers/material.controller.js";

const router = express.Router();

// GET /api/materials
router.get("/", getAllMaterials);

export default router;
