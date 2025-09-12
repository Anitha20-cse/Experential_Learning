const User = require("../models/User");

const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await User.findOne({ email, role: "teacher" });
    if (!teacher) {
      return res.status(400).json({ message: "❌ Teacher not found" });
    }

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

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(400).json({ message: "❌ Admin not found" });
    }

    if (admin.password !== password) {
      return res.status(400).json({ message: "⚠️ Invalid password" });
    }

    res.status(200).json({
      message: "✅ Login successful",
      teacher: {
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { loginTeacher,adminLogin };
