import mongoose from "mongoose";

const pyqSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    course: {
      type: String,
      required: true,
      lowercase: true, // btech, bca, bsc, ba
    },
    branch: {
      type: String,
      default: null, // null for bca, bsc, ba
    },
    semester: {
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
  {
    timestamps: true, // createdAt, updatedAt (frontend can ignore)
  },
);

const PYQ = mongoose.model("PYQ", pyqSchema);

export default PYQ;
