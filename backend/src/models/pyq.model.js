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
    fileUrl: {
      type: String,
      default: null,
    },
    filePublicId: {
      type: String,
      default: null,
    },
    driveLink: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt (frontend can ignore)
  },
);

pyqSchema.pre("validate", function ensureResourceLink(next) {
  const hasFileUrl =
    typeof this.fileUrl === "string" && this.fileUrl.trim().length > 0;
  const hasDriveLink =
    typeof this.driveLink === "string" && this.driveLink.trim().length > 0;

  if (!hasFileUrl && !hasDriveLink) {
    this.invalidate("fileUrl", "Either fileUrl or driveLink is required");
    this.invalidate("driveLink", "Either fileUrl or driveLink is required");
  }

  next();
});

const PYQ = mongoose.model("PYQ", pyqSchema);

export default PYQ;
