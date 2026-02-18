import User from "../../models/user.model.js";
import PYQ from "../../models/pyq.model.js";
import Material from "../../models/material.model.js";
import Organizer from "../../models/organizer.model.js";
import Syllabus from "../../models/syllabus.model.js";

export const getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, pyqs, materials, organizers, syllabus] =
      await Promise.all([
        User.countDocuments(),
        PYQ.countDocuments(),
        Material.countDocuments(),
        Organizer.countDocuments(),
        Syllabus.countDocuments(),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        pyqs,
        materials,
        organizers,
        syllabus,
      },
    });
  } catch (error) {
    next(error);
  }
};
