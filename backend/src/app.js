import express from "express";
import cors from "cors";

import pyqRoutes from "./routes/pyq.routes.js";
import materialRoutes from "./routes/material.routes.js";
import organizerRoutes from "./routes/organizer.routes.js";
import syllabusRoutes from "./routes/syllabus.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/pyqs", pyqRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/organizers", organizerRoutes);
app.use("/api/syllabus", syllabusRoutes);

// test route
app.get("/", (req, res) => {
  res.send("M Hub Backend API is running");
});

export default app;
