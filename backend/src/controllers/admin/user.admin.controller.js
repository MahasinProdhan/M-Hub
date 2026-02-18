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
