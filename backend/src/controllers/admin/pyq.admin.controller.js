import PYQ from "../../models/pyq.model.js";

// CREATE PYQ
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

// DELETE PYQ
export const deletePYQ = async (req, res, next) => {
  try {
    const pyq = await PYQ.findById(req.params.id);

    if (!pyq) {
      return res.status(404).json({
        message: "PYQ not found",
      });
    }

    await pyq.deleteOne();

    res.status(200).json({
      message: "PYQ deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
