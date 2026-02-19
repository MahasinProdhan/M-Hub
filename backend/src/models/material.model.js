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
  { timestamps: true },
);

materialSchema.pre("validate", function ensureResourceLink(next) {
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

const StudyMaterial = mongoose.model("StudyMaterial", materialSchema);

export default StudyMaterial;
