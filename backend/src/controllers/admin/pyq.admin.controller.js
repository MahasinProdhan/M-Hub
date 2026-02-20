import PYQ from "../../models/pyq.model.js";
import {
  deletePdfFromCloudinary,
  resolveResourceLinks,
} from "../../utils/pdfUpload.utils.js";

const VALID_COURSES = new Set(["btech", "bca", "bsc", "ba"]);

// CREATE PYQ
export const createPYQ = async (req, res, next) => {
  try {
    const {
      title,
      subject,
      course,
      branch,
      semester,
      year,
      fileType,
      driveLink,
    } = req.body;

    // Basic validation
    if (
      !title ||
      !subject ||
      !course ||
      !semester ||
      !year ||
      !fileType
    ) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const resourceLinks = await resolveResourceLinks({
      file: req.file,
      driveLink,
    });

    if (!resourceLinks.ok) {
      return res.status(resourceLinks.status).json({
        message: resourceLinks.message,
      });
    }

    const pyq = await PYQ.create({
      title,
      subject,
      course,
      branch: branch || null,
      semester,
      year,
      fileType,
      fileUrl: resourceLinks.fileUrl,
      filePublicId: resourceLinks.filePublicId,
      driveLink: resourceLinks.driveLink,
    });

    res.status(201).json({
      message: resourceLinks.fallbackUsed
        ? "PYQ created successfully using Drive fallback"
        : "PYQ created successfully",
      pyq,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE PYQ DETAILS
export const updatePYQ = async (req, res, next) => {
  try {
    const pyq = await PYQ.findById(req.params.id);

    if (!pyq) {
      return res.status(404).json({
        message: "PYQ not found",
      });
    }

    const updates = {};
    const { subject, course, branch, semester, year } = req.body || {};

    if (subject !== undefined) {
      const normalizedSubject = String(subject).trim();
      if (!normalizedSubject) {
        return res.status(400).json({
          message: "Subject is required",
        });
      }
      updates.subject = normalizedSubject;
    }

    if (course !== undefined) {
      const normalizedCourse = String(course).trim().toLowerCase();

      if (!VALID_COURSES.has(normalizedCourse)) {
        return res.status(400).json({
          message: "Invalid course value",
        });
      }

      updates.course = normalizedCourse;

      if (normalizedCourse !== "btech") {
        updates.branch = null;
      }
    }

    const effectiveCourse = updates.course || pyq.course;

    if (branch !== undefined) {
      const normalizedBranch = String(branch).trim();

      if (effectiveCourse === "btech" && !normalizedBranch) {
        return res.status(400).json({
          message: "Branch is required for BTech PYQ",
        });
      }

      updates.branch = effectiveCourse === "btech" ? normalizedBranch : null;
    } else if (effectiveCourse === "btech" && !String(pyq.branch || "").trim()) {
      return res.status(400).json({
        message: "Branch is required for BTech PYQ",
      });
    }

    if (semester !== undefined) {
      const normalizedSemester = Number(semester);

      if (!Number.isInteger(normalizedSemester) || normalizedSemester < 1 || normalizedSemester > 8) {
        return res.status(400).json({
          message: "Semester must be an integer between 1 and 8",
        });
      }

      updates.semester = normalizedSemester;
    }

    if (year !== undefined) {
      const normalizedYear = Number(year);
      const maxAllowedYear = new Date().getFullYear() + 1;

      if (!Number.isInteger(normalizedYear) || normalizedYear < 1900 || normalizedYear > maxAllowedYear) {
        return res.status(400).json({
          message: `Year must be an integer between 1900 and ${maxAllowedYear}`,
        });
      }

      updates.year = normalizedYear;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided for update",
      });
    }

    Object.assign(pyq, updates);
    await pyq.save();

    res.status(200).json({
      message: "PYQ updated successfully",
      pyq,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE PYQ
export const deletePYQ = async (req, res, next) => {
  try {
    const pyq = await PYQ.findById(req.params.id);

    if (!pyq) {
      return res.status(404).json({
        message: "PYQ not found",
      });
    }

    try {
      await deletePdfFromCloudinary(pyq);
    } catch (cloudinaryError) {
      console.error(
        "Failed to delete Cloudinary PDF for PYQ:",
        cloudinaryError.message,
      );
    }

    await pyq.deleteOne();

    res.status(200).json({
      message: "PYQ deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
