import mongoose from "mongoose";
import dotenv from "dotenv";
import StudyMaterial from "../models/material.model.js";

dotenv.config();

const materialData = [
  {
    title: "OS Notes – Unit 1",
    subject: "Operating System",
    course: "btech",
    branch: "Computer Science Engineering",
    semester: 4,
    type: "notes",
    fileType: "PDF",
    driveLink: "https://drive.google.com/file/d/OS_NOTES/view",
  },
  {
    title: "DBMS Reference Book",
    subject: "DBMS",
    course: "btech",
    branch: "Information Technology",
    semester: 3,
    type: "reference",
    fileType: "PDF",
    driveLink: "https://drive.google.com/file/d/DBMS_REF/view",
  },
  {
    title: "Discrete Math Guide",
    subject: "Discrete Mathematics",
    course: "bca",
    branch: null,
    semester: 12,
    type: "guide",
    fileType: "PDF",
    driveLink: "https://drive.google.com/file/d/DM_GUIDE/view",
  },
];

const seedMaterials = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await StudyMaterial.deleteMany();
    await StudyMaterial.insertMany(materialData);

    console.log("✅ Study Materials seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedMaterials();
