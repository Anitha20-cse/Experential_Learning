const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },

    email: { 
      type: String, 
      required: true, 
      unique: true 
    },

    password: { 
      type: String, 
      required: true 
    }, // plain text or "google-auth" for OAuth users

    role: {
      type: String,
      enum: ["admin", "teacher", "student", "parent"], // ✅ all roles retained
      required: true,
      default: "student",
    },

    regNo: { 
      type: String 
    }, // for parents or students if needed

    lastLogin: { 
      type: Date 
    }, // track last login timestamp

  },
  { timestamps: true }
);

// ✅ Explicitly specify collection name "User"
const User = mongoose.model("User", userSchema, "User");

module.exports = User;
