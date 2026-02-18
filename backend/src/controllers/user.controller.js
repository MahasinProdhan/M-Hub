import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";
import PYQ from "../models/pyq.model.js";
import StudyMaterial from "../models/material.model.js";
import Organizer from "../models/organizer.model.js";
import {
  extractCloudinaryPublicId,
  toAvatarClientPath,
} from "../utils/avatar.utils.js";

const RESOURCE_MODEL_MAP = {
  pyq: PYQ,
  material: StudyMaterial,
  organizer: Organizer,
};

const RESOURCE_SELECT_FIELDS = {
  pyq: "subject year course branch semester fileType driveLink",
  material: "title subject course branch semester type fileType driveLink",
  organizer: "title subject course branch semester year fileType driveLink",
};

const getUserIdFromRequest = (req) => req.user?._id || req.user?.id || req.user?.userId;

const isValidResourceType = (value) =>
  typeof value === "string" &&
  Object.prototype.hasOwnProperty.call(RESOURCE_MODEL_MAP, value);

const getSavedResourceKey = (resourceType, resourceId) =>
  `${resourceType}:${String(resourceId)}`;

const formatUserAvatarForClient = (userDoc) => {
  if (!userDoc) return userDoc;

  const user =
    typeof userDoc.toObject === "function" ? userDoc.toObject() : { ...userDoc };

  user.avatar = toAvatarClientPath(user.avatar);
  return user;
};

const hydrateSavedResources = async (savedResources) => {
  if (!Array.isArray(savedResources) || savedResources.length === 0) {
    return [];
  }

  const idsByType = {
    pyq: [],
    material: [],
    organizer: [],
  };

  for (const item of savedResources) {
    if (!isValidResourceType(item.resourceType)) continue;
    if (!mongoose.Types.ObjectId.isValid(item.resourceId)) continue;
    idsByType[item.resourceType].push(item.resourceId);
  }

  const [pyqs, materials, organizers] = await Promise.all([
    idsByType.pyq.length > 0
      ? PYQ.find({ _id: { $in: idsByType.pyq } })
          .select(RESOURCE_SELECT_FIELDS.pyq)
          .lean()
      : Promise.resolve([]),
    idsByType.material.length > 0
      ? StudyMaterial.find({ _id: { $in: idsByType.material } })
          .select(RESOURCE_SELECT_FIELDS.material)
          .lean()
      : Promise.resolve([]),
    idsByType.organizer.length > 0
      ? Organizer.find({ _id: { $in: idsByType.organizer } })
          .select(RESOURCE_SELECT_FIELDS.organizer)
          .lean()
      : Promise.resolve([]),
  ]);

  const lookup = new Map();

  for (const pyq of pyqs) {
    lookup.set(getSavedResourceKey("pyq", pyq._id), pyq);
  }

  for (const material of materials) {
    lookup.set(getSavedResourceKey("material", material._id), material);
  }

  for (const organizer of organizers) {
    lookup.set(getSavedResourceKey("organizer", organizer._id), organizer);
  }

  const hydratedItems = [];

  for (const item of savedResources) {
    const key = getSavedResourceKey(item.resourceType, item.resourceId);
    const resource = lookup.get(key);

    if (!resource) continue;

    hydratedItems.push({
      resourceType: item.resourceType,
      resourceId: String(item.resourceId),
      resource,
    });
  }

  return hydratedItems;
};

/**
 * GET MY PROFILE
 * GET /api/users/me
 */
export const getMyProfile = async (req, res, next) => {
  try {
    const userId = getUserIdFromRequest(req);

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
    const userId = getUserIdFromRequest(req);

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
 * SAVE RESOURCE
 * POST /api/users/saved
 */
export const saveResource = async (req, res, next) => {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { resourceType, resourceId } = req.body || {};

    if (!isValidResourceType(resourceType)) {
      return res.status(400).json({
        message: "resourceType must be one of: pyq, material, organizer",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return res.status(400).json({ message: "Invalid resourceId" });
    }

    const ResourceModel = RESOURCE_MODEL_MAP[resourceType];
    const resource = await ResourceModel.findById(resourceId)
      .select(RESOURCE_SELECT_FIELDS[resourceType])
      .lean();

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const user = await User.findById(userId).select("savedResources");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadySaved = user.savedResources.some(
      (item) =>
        item.resourceType === resourceType &&
        String(item.resourceId) === String(resourceId),
    );

    if (alreadySaved) {
      return res.status(409).json({ message: "Resource already saved" });
    }

    user.savedResources.unshift({
      resourceType,
      resourceId,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Resource saved",
      data: {
        resourceType,
        resourceId: String(resourceId),
        resource,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UNSAVE RESOURCE
 * DELETE /api/users/saved
 */
export const unsaveResource = async (req, res, next) => {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { resourceType, resourceId } = req.body || {};

    if (!isValidResourceType(resourceType)) {
      return res.status(400).json({
        message: "resourceType must be one of: pyq, material, organizer",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return res.status(400).json({ message: "Invalid resourceId" });
    }

    const user = await User.findById(userId).select("savedResources");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const originalCount = user.savedResources.length;
    user.savedResources = user.savedResources.filter(
      (item) =>
        !(
          item.resourceType === resourceType &&
          String(item.resourceId) === String(resourceId)
        ),
    );

    if (user.savedResources.length !== originalCount) {
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Resource unsaved",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET SAVED RESOURCES
 * GET /api/users/saved
 */
export const getSavedResources = async (req, res, next) => {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(userId).select("savedResources").lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hydratedSavedResources = await hydrateSavedResources(
      user.savedResources || [],
    );

    res.status(200).json({
      success: true,
      count: hydratedSavedResources.length,
      data: hydratedSavedResources,
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
