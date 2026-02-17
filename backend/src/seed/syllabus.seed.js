import mongoose from "mongoose";
import dotenv from "dotenv";
import Syllabus from "../models/syllabus.model.js";

dotenv.config();

const syllabusData = [
  {
    course: "btech",
    branch: "Computer Science Engineering",
    semester: 1,
    driveLink: "https://drive.google.com/file/d/BTECH_CSE_SEM1_SYL/view",
  },
  {
    course: "btech",
    branch: "Computer Science Engineering",
    semester: 2,
    driveLink: "https://drive.google.com/file/d/BTECH_CSE_SEM2_SYL/view",
  },
  {
    course: "bca",
    branch: null,
    semester: 1,
    driveLink: "https://drive.google.com/file/d/BCA_SEM1_SYL/view",
  },
  {
    course: "bsc",
    branch: null,
    semester: 1,
    driveLink: "https://drive.google.com/file/d/BSC_SEM1_SYL/view",
  },
  {
    course: "btech",
    branch: "Computer Science Engineering",
    semester: 3,
    driveLink: "https://drive.google.com/file/d/BTECH_CSE_SEM3_SYL/view",
  },
  {
    course: "btech",
    branch: "Computer Science Engineering",
    semester: 4,
    driveLink: "https://drive.google.com/file/d/BTECH_CSE_SEM4_SYL/view",
  },
  {
    course: "btech",
    branch: "Information Technology",
    semester: 1,
    driveLink: "https://drive.google.com/file/d/BTECH_IT_SEM1_SYL/view",
  },
  {
    course: "btech",
    branch: "Information Technology",
    semester: 2,
    driveLink: "https://drive.google.com/file/d/BTECH_IT_SEM2_SYL/view",
  },
];

const seedSyllabus = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Syllabus.deleteMany();
    await Syllabus.insertMany(syllabusData);

    console.log("✅ Syllabus seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Syllabus seeding failed:", error);
    process.exit(1);
  }
};

seedSyllabus();
