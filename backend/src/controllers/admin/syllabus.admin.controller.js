import Syllabus from "../../models/syllabus.model.js";
import {
  deletePdfFromCloudinary,
  resolveResourceLinks,
} from "../../utils/pdfUpload.utils.js";

// CREATE SYLLABUS
export const createSyllabus = async (req, res, next) => {
  try {
    const { course, branch, semester, driveLink } = req.body;

    if (!course || !semester) {
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

    const syllabus = await Syllabus.create({
      course,
      branch: branch || null,
      semester,
      fileUrl: resourceLinks.fileUrl,
      filePublicId: resourceLinks.filePublicId,
      driveLink: resourceLinks.driveLink,
    });

    res.status(201).json({
      message: resourceLinks.fallbackUsed
        ? "Syllabus created successfully using Drive fallback"
        : "Syllabus created successfully",
      syllabus,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE SYLLABUS
export const deleteSyllabus = async (req, res, next) => {
  try {
    const syllabus = await Syllabus.findById(req.params.id);

    if (!syllabus) {
      return res.status(404).json({
        message: "Syllabus not found",
      });
    }

    try {
      await deletePdfFromCloudinary(syllabus);
    } catch (cloudinaryError) {
      console.error(
        "Failed to delete Cloudinary PDF for syllabus:",
        cloudinaryError.message,
      );
    }

    await syllabus.deleteOne();

    res.status(200).json({
      message: "Syllabus deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
