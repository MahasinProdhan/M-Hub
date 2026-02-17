import Organizer from "../models/organizer.model.js";

export const getAllOrganizers = async (req, res, next) => {
  try {
    const { course, semester, branch, subject, search } = req.query;

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

    if (subject && subject !== "all") {
      filters.subject = subject;
    }

    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    const organizers = await Organizer.find(filters).sort({ year: -1 });

    res.status(200).json({
      success: true,
      count: organizers.length,
      data: organizers,
    });
  } catch (error) {
    next(error);
  }
};
