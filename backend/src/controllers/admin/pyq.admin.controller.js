import PYQ from "../../models/pyq.model.js";

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
      !fileType ||
      !driveLink
    ) {
      return res.status(400).json({
        message: "Missing required fields",
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
      driveLink,
    });

    res.status(201).json({
      message: "PYQ created successfully",
      pyq,
    });
  } catch (error) {
    next(error);
  }
};
