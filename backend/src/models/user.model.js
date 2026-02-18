import mongoose from "mongoose";

const savedResourceSchema = new mongoose.Schema(
  {
    resourceType: {
      type: String,
      enum: ["pyq", "material", "organizer"],
      required: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },

    college: {
      type: String,
      trim: true,
      default: "",
    },

    course: {
      type: String,
      enum: ["btech", "bca", "bsc", "ba", ""],
      default: "",
    },

    branch: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    savedResources: {
      type: [savedResourceSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
