import mongoose from "mongoose";
import dotenv from "dotenv";
import Organizer from "../models/organizer.model.js";

dotenv.config();

const organizerData = [
  {
    title: "OS Model Questions 2023",
    subject: "Operating System",
    course: "btech",
    branch: "Computer Science Engineering",
    semester: 4,
    year: 2023,
    fileType: "PDF",
    driveLink: "https://drive.google.com/file/d/OS_ORG_2023/view",
  },
  {
    title: "Artificial Intelligence Organizer 2024",
    subject: "Artificial Intelligence",
    course: "btech",
    branch: "Computer Science Engineering",
    semester: 7,
    year: 2024,
    fileType: "PDF",
    driveLink: "https://drive.google.com/file/d/AI_ORG_2024/view",
  },
  {
    title: "Mathematics II Organizer 2022",
    subject: "Engineering Mathematics II",
    course: "btech",
    branch: "Electrical Engineering",
    semester: 2,
    year: 2022,
    fileType: "PDF",
    driveLink: "https://drive.google.com/file/d/MATH2_ORG_2022/view",
  },
  {
    title: "DBMS Organizer 2022",
    subject: "DBMS",
    course: "btech",
    branch: "Information Technology",
    semester: 3,
    year: 2022,
    fileType: "PDF",
    driveLink: "https://drive.google.com/file/d/DBMS_ORG_2022/view",
  },
  {
    title: "Discrete Math Model Set",
    subject: "Discrete Mathematics",
    course: "bca",
    branch: null,
    semester: 2,
    year: 2021,
    fileType: "PDF",
    driveLink: "https://drive.google.com/file/d/DM_ORG_2021/view",
  },
];

const seedOrganizers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Organizer.deleteMany();
    await Organizer.insertMany(organizerData);

    console.log("✅ Organizers seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Organizer seeding failed:", error);
    process.exit(1);
  }
};

seedOrganizers();
