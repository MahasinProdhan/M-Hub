import mongoose from "mongoose";

const organizerSchema = new mongoose.Schema(
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
    year: {
      type: Number,
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

const Organizer = mongoose.model("Organizer", organizerSchema);

export default Organizer;
