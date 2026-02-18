import Organizer from "../../models/organizer.model.js";

// CREATE ORGANIZER
export const createOrganizer = async (req, res, next) => {
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

    const organizer = await Organizer.create({
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
      message: "Organizer created successfully",
      organizer,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE ORGANIZER
export const deleteOrganizer = async (req, res, next) => {
  try {
    const organizer = await Organizer.findById(req.params.id);

    if (!organizer) {
      return res.status(404).json({
        message: "Organizer not found",
      });
    }

    await organizer.deleteOne();

    res.status(200).json({
      message: "Organizer deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
