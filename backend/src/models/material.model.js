import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
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
    type: {
      type: String, // notes, reference, guide
      required: true,
    },
    fileType: {
      type: String,
      default: "PDF",
    },
    driveLink: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const StudyMaterial = mongoose.model("StudyMaterial", materialSchema);

export default StudyMaterial;
