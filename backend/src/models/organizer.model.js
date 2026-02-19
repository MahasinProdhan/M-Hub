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

organizerSchema.pre("validate", function ensureResourceLink(next) {
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

const Organizer = mongoose.model("Organizer", organizerSchema);

export default Organizer;
