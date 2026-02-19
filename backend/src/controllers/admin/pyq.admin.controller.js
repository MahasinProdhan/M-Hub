import PYQ from "../../models/pyq.model.js";
import {
  deletePdfFromCloudinary,
  resolveResourceLinks,
} from "../../utils/pdfUpload.utils.js";

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
