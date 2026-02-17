import mongoose from "mongoose";
import dotenv from "dotenv";

import PYQ from "../models/pyq.model.js";

dotenv.config();

const pyqData = [
  {
    subject: "Operating System",
    year: 2023,
    course: "btech",
    branch: "Computer Science Engineering",
    semester: 4,
    fileType: "PDF",
    driveLink: "https://drive.google.com/file/d/OS2023/view?usp=sharing",
  },
  {
    subject: "DBMS",
    year: 2022,
    course: "btech",
    branch: "Information Technology",
    semester: 3,
    fileType: "PDF",
    driveLink: "https://drive.google.com/file/d/DBMS2022/view?usp=sharing",
  },
  {
    subject: "Data Structures",
    year: 2021,
    course: "btech",
    branch: "Computer Science Engineering",
    semester: 3,
    fileType: "PDF",
    driveLink: "https://drive.google.com/file/d/DS2021/view?usp=sharing",
  },
  {
    subject: "Computer Networks",
    year: 2023,
    course: "btech",
    branch: "Computer Science Engineering",
    semester: 5,
    fileType: "PDF",
    driveLink: "https://drive.google.com/file/d/CN2023/view?usp=sharing",
  },
  {
    subject: "Software Engineering",
    year: 2022,
    course: "btech",
    branch: "Information Technology",
    semester: 5,
    fileType: "PDF",
    driveLink: "https://drive.google.com/file/d/SE2022/view?usp=sharing",
  },
  {
    subject: "Discrete Mathematics",
    year: 2021,
    course: "bca",
    branch: null,
    semester: 2,
    fileType: "PDF",
    driveLink: "https://drive.google.com/file/d/DM2021/view?usp=sharing",
  },
  {
    subject: "Web Technology",
    year: 2023,
    course: "bca",
    branch: null,
    semester: 4,
    fileType: "PDF",
    driveLink: "https://drive.google.com/file/d/WT2023/view?usp=sharing",
  },
  {
    subject: "Physics",
    year: 2022,
    course: "bsc",
    branch: null,
    semester: 1,
    fileType: "PDF",
    driveLink: "https://drive.google.com/file/d/PHY2022/view?usp=sharing",
  },
  {
    subject: "Mathematics",
    year: 2023,
    course: "bsc",
    branch: null,
    semester: 2,
    fileType: "PDF",
    driveLink: "https://drive.google.com/file/d/MATH2023/view?usp=sharing",
  },
  {
    subject: "English",
    year: 2028,
    course: "ba",
    branch: null,
    semester: 1,
    fileType: "PDF",
    driveLink: "https://drive.google.com/file/d/ENG2021/view?usp=sharing",
  },
];

const seedPYQs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // clear existing data (optional but recommended)
    await PYQ.deleteMany();

    await PYQ.insertMany(pyqData);

    console.log("✅ PYQ data seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding PYQs:", error);
    process.exit(1);
  }
};

seedPYQs();
