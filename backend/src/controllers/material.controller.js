import StudyMaterial from "../models/material.model.js";

export const getAllMaterials = async (req, res, next) => {
  try {
    const { course, semester, branch, subject, type, search } = req.query;
    const normalizedSearch = typeof search === "string" ? search.trim() : "";

    const filters = {};

    if (course && course !== "all") filters.course = course;
    if (semester && semester !== "all") filters.semester = Number(semester);
    if (branch && branch !== "all") filters.branch = branch;
    if (subject && subject !== "all") filters.subject = subject;
    if (type && type !== "all") filters.type = type;

    if (normalizedSearch) {
      filters.$or = [
        { title: { $regex: normalizedSearch, $options: "i" } },
        { subject: { $regex: normalizedSearch, $options: "i" } },
      ];
    }

    const materials = await StudyMaterial.find(filters).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: materials.length,
      data: materials,
    });
  } catch (error) {
    next(error);
  }
};
