import Syllabus from "../../models/syllabus.model.js";

export const createSyllabus = async (req, res, next) => {
  try {
    const { course, branch, semester, driveLink } = req.body;

    if (!course || !semester || !driveLink) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const syllabus = await Syllabus.create({
      course,
      branch: branch || null,
      semester,
      driveLink,
    });

    res.status(201).json({
      message: "Syllabus created successfully",
      syllabus,
    });
  } catch (error) {
    next(error);
  }
};
