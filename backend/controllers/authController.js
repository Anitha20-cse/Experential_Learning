const User = require("../models/User");

// ----------------- TEACHER LOGIN -----------------
const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find teacher by email and role
    const teacher = await User.findOne({ email, role: "teacher" });
    if (!teacher) {
      return res.status(400).json({ message: "❌ Teacher not found" });
    }

    // Compare password directly (plain text)
    if (teacher.password !== password) {
      return res.status(400).json({ message: "⚠️ Invalid password" });
    }

    res.status(200).json({
      message: "✅ Login successful",
      teacher: {
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { loginTeacher };
