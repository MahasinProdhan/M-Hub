import Organizer from "../../models/organizer.model.js";

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
