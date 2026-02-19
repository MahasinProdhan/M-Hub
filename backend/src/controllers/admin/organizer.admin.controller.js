import Organizer from "../../models/organizer.model.js";
import {
  deletePdfFromCloudinary,
  resolveResourceLinks,
} from "../../utils/pdfUpload.utils.js";

// CREATE ORGANIZER
export const createOrganizer = async (req, res, next) => {
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

    const organizer = await Organizer.create({
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
        ? "Organizer created successfully using Drive fallback"
        : "Organizer created successfully",
      organizer,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE ORGANIZER
export const deleteOrganizer = async (req, res, next) => {
  try {
    const organizer = await Organizer.findById(req.params.id);

    if (!organizer) {
      return res.status(404).json({
        message: "Organizer not found",
      });
    }

    try {
      await deletePdfFromCloudinary(organizer);
    } catch (cloudinaryError) {
      console.error(
        "Failed to delete Cloudinary PDF for organizer:",
        cloudinaryError.message,
      );
    }

    await organizer.deleteOne();

    res.status(200).json({
      message: "Organizer deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
