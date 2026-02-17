import Material from "../../models/material.model.js";

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
