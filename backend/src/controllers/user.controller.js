import cloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";
import {
  extractCloudinaryPublicId,
  toAvatarClientPath,
} from "../utils/avatar.utils.js";

const formatUserAvatarForClient = (userDoc) => {
  if (!userDoc) return userDoc;

  const user =
    typeof userDoc.toObject === "function" ? userDoc.toObject() : { ...userDoc };

  user.avatar = toAvatarClientPath(user.avatar);
  return user;
};

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
      user: formatUserAvatarForClient(user),
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
    let oldAvatarPublicId = null;

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
      const existingUser = await User.findById(userId).select("avatar");

      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      oldAvatarPublicId = extractCloudinaryPublicId(existingUser.avatar);
      updates.avatar = req.file.path;
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      returnDocument: "after",
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (oldAvatarPublicId) {
      try {
        await cloudinary.uploader.destroy(oldAvatarPublicId);
      } catch (cloudinaryError) {
        console.error(
          "Failed to delete old Cloudinary avatar:",
          cloudinaryError.message,
        );
      }
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: formatUserAvatarForClient(user),
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

    const responseUsers = users.map((user) => formatUserAvatarForClient(user));

    res.status(200).json({
      success: true,
      count: responseUsers.length,
      data: responseUsers,
    });
  } catch (error) {
    next(error);
  }
};
