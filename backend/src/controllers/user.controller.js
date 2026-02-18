import User from "../models/user.model.js";

/**
 * GET MY PROFILE
 * GET /api/users/me
 */
export const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE MY PROFILE
 * PATCH /api/users/me
 */
export const updateMyProfile = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { name, college, course, branch } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name;
    if (college !== undefined) updates.college = college;

    if (course !== undefined) {
      updates.course = course;

      if (course !== "btech") {
        updates.branch = "";
      } else if (branch !== undefined) {
        updates.branch = branch;
      }
    } else if (branch !== undefined) {
      updates.branch = branch;
    }

    if (req.file) {
      updates.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ADMIN: GET ALL USERS
 * GET /api/admin/users
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("name email role college course branch avatar createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
