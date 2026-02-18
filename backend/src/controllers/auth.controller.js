import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * REGISTER
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, college, course, branch } = req.body;

    // Basic validation
    if (!name || !email || !password || !college || !course) {
      return res.status(400).json({
        message: "Name, email, password, college and course are required",
      });
    }

    // BTech requires branch
    if (course === "btech" && !branch) {
      return res.status(400).json({
        message: "Branch is required for BTech students",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      college,
      course,
      branch: course === "btech" ? branch : null,
      role: "user", // force user role
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        course: user.course,
        branch: user.branch,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * LOGIN
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        course: user.course,
        branch: user.branch,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
