import Organizer from "../models/organizer.model.js";
import { withPdfViewUrl } from "../utils/pdfView.utils.js";

export const getAllOrganizers = async (req, res, next) => {
  try {
    const { course, semester, branch, subject, search } = req.query;
    const normalizedSearch = typeof search === "string" ? search.trim() : "";

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

    if (normalizedSearch) {
      filters.$or = [
        { title: { $regex: normalizedSearch, $options: "i" } },
        { subject: { $regex: normalizedSearch, $options: "i" } },
      ];
    }

    const organizers = await Organizer.find(filters).sort({ year: -1 });
    const responseData = organizers.map((organizer) =>
      withPdfViewUrl(organizer, req),
    );

    res.status(200).json({
      success: true,
      count: responseData.length,
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};
