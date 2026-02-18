import mongoose from "mongoose";
import User from "../../models/user.model.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("name email college course branch role createdAt")
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

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Role must be either 'user' or 'admin'" });
    }

    const requesterId = String(req.user?._id || "");
    if (!requesterId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (requesterId === String(id)) {
      return res.status(400).json({ message: "Superadmin cannot change their own role" });
    }

    const targetUser = await User.findById(id);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser.role === "superadmin") {
      return res.status(400).json({ message: "Superadmin role cannot be changed via API" });
    }

    if (targetUser.role === role) {
      return res.status(400).json({ message: `User is already ${role}` });
    }

    const validTransition =
      (targetUser.role === "user" && role === "admin") ||
      (targetUser.role === "admin" && role === "user");

    if (!validTransition) {
      return res.status(400).json({ message: "Invalid role transition" });
    }

    targetUser.role = role;
    await targetUser.save();

    const updatedUser = await User.findById(id).select("-password");

    res.status(200).json({
      success: true,
      message:
        role === "admin"
          ? "User promoted to admin successfully"
          : "Admin privileges removed successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
