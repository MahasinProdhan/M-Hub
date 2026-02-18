import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import pyqRoutes from "./routes/pyq.routes.js";
import materialRoutes from "./routes/material.routes.js";
import organizerRoutes from "./routes/organizer.routes.js";
import syllabusRoutes from "./routes/syllabus.routes.js";
import userRoutes from "./routes/user.routes.js";

import adminPYQRoutes from "./routes/admin/pyq.admin.routes.js";
import adminMaterialRoutes from "./routes/admin/material.admin.routes.js";
import adminOrganizerRoutes from "./routes/admin/organizer.admin.routes.js";
import adminSyllabusRoutes from "./routes/admin/syllabus.admin.routes.js";
import adminStatsRoutes from "./routes/admin/stats.admin.routes.js";
import adminUserRoutes from "./routes/admin/user.admin.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 REQUIRED FOR __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 SERVE UPLOADS CORRECTLY
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/pyqs", pyqRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/organizers", organizerRoutes);
app.use("/api/syllabus", syllabusRoutes);
app.use("/api/users", userRoutes);

// admin routes
app.use("/api/admin", adminPYQRoutes);
app.use("/api/admin", adminMaterialRoutes);
app.use("/api/admin", adminOrganizerRoutes);
app.use("/api/admin", adminSyllabusRoutes);
app.use("/api/admin", adminStatsRoutes);
app.use("/api/admin", adminUserRoutes);

app.get("/", (req, res) => {
  res.send("M Hub Backend API is running");
});

export default app;
