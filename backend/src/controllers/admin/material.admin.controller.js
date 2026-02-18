import Material from "../../models/material.model.js";

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
      !fileType ||
      !driveLink
    ) {
      return res.status(400).json({
        message: "Missing required fields",
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
      driveLink,
    });

    res.status(201).json({
      message: "Study material created successfully",
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

    await material.deleteOne();

    res.status(200).json({
      message: "Study material deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
