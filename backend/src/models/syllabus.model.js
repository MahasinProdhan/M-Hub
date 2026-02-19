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

syllabusSchema.pre("validate", function ensureResourceLink(next) {
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

const Syllabus = mongoose.model("Syllabus", syllabusSchema);

export default Syllabus;
