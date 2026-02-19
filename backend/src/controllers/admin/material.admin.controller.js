import Material from "../../models/material.model.js";
import {
  deletePdfFromCloudinary,
  resolveResourceLinks,
} from "../../utils/pdfUpload.utils.js";

// CREATE STUDY MATERIAL
export const createMaterial = async (req, res, next) => {
  try {
    const {
      title,
      subject,
      course,
      branch,
      semester,
      type,
      fileType,
      driveLink,
    } = req.body;

    if (
      !title ||
      !subject ||
      !course ||
      !semester ||
      !type ||
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

    const material = await Material.create({
      title,
      subject,
      course,
      branch: branch || null,
      semester,
      type,
      fileType,
      fileUrl: resourceLinks.fileUrl,
      filePublicId: resourceLinks.filePublicId,
      driveLink: resourceLinks.driveLink,
    });

    res.status(201).json({
      message: resourceLinks.fallbackUsed
        ? "Study material created successfully using Drive fallback"
        : "Study material created successfully",
      material,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE STUDY MATERIAL
export const deleteMaterial = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        message: "Study material not found",
      });
    }

    try {
      await deletePdfFromCloudinary(material);
    } catch (cloudinaryError) {
      console.error(
        "Failed to delete Cloudinary PDF for study material:",
        cloudinaryError.message,
      );
    }

    await material.deleteOne();

    res.status(200).json({
      message: "Study material deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
