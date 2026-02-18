import Syllabus from "../../models/syllabus.model.js";

// CREATE SYLLABUS
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

// DELETE SYLLABUS
export const deleteSyllabus = async (req, res, next) => {
  try {
    const syllabus = await Syllabus.findById(req.params.id);

    if (!syllabus) {
      return res.status(404).json({
        message: "Syllabus not found",
      });
    }

    await syllabus.deleteOne();

    res.status(200).json({
      message: "Syllabus deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
