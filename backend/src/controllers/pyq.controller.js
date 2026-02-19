import PYQ from "../models/pyq.model.js";

export const getAllPYQs = async (req, res, next) => {
  try {
    const { course, semester, branch, subject, search } = req.query;
    const normalizedSearch = typeof search === "string" ? search.trim() : "";

    const filters = {};

    // apply filters only if not "all"
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

    // search in subject without overriding an exact subject filter
    if (normalizedSearch) {
      const searchFilter = {
        subject: { $regex: normalizedSearch, $options: "i" },
      };

      if (filters.subject) {
        filters.$and = [...(filters.$and || []), searchFilter];
      } else {
        filters.subject = searchFilter.subject;
      }
    }

    const pyqs = await PYQ.find(filters).sort({ year: -1 });

    res.status(200).json({
      success: true,
      count: pyqs.length,
      data: pyqs,
    });
  } catch (error) {
    next(error);
  }
};
