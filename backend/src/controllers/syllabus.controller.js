import Syllabus from "../models/syllabus.model.js";

export const getAllSyllabus = async (req, res, next) => {
  try {
    const { course, semester, branch } = req.query;

    const filters = {};

    if (course && course !== "all") {
      filters.course = course;
    }

    if (semester && semester !== "all") {
      filters.semester = Number(semester);
    }

    if (branch && branch !== "all") {
      filters.branch = branch;
    }

    const syllabus = await Syllabus.find(filters).sort({ semester: 1 });

    res.status(200).json({
      success: true,
      count: syllabus.length,
      data: syllabus,
    });
  } catch (error) {
    next(error);
  }
};
