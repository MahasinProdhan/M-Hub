import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import pyqRoutes from "./routes/pyq.routes.js";
import materialRoutes from "./routes/material.routes.js";
import organizerRoutes from "./routes/organizer.routes.js";
import syllabusRoutes from "./routes/syllabus.routes.js";

//Register Admin Routes
import adminPYQRoutes from "./routes/admin/pyq.admin.routes.js";
import adminMaterialRoutes from "./routes/admin/material.admin.routes.js";
import adminOrganizerRoutes from "./routes/admin/organizer.admin.routes.js";
import adminSyllabusRoutes from "./routes/admin/syllabus.admin.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/pyqs", pyqRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/organizers", organizerRoutes);
app.use("/api/syllabus", syllabusRoutes);

//admin routes
app.use("/api/admin", adminPYQRoutes);
app.use("/api/admin", adminMaterialRoutes);
app.use("/api/admin", adminOrganizerRoutes);
app.use("/api/admin", adminSyllabusRoutes);

// test route
app.get("/", (req, res) => {
  res.send("M Hub Backend API is running");
});

export default app;
