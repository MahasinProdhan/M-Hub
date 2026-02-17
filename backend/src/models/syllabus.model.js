import mongoose from "mongoose";

const syllabusSchema = new mongoose.Schema(
  {
    course: {
      type: String,
      required: true,
      lowercase: true,
    },
    branch: {
      type: String,
      default: null,
    },
    semester: {
      type: Number,
      required: true,
    },
    driveLink: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Syllabus = mongoose.model("Syllabus", syllabusSchema);

export default Syllabus;
