const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const Teacher = require("../models/Teacher");

// ✅ Initialize Google Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ✅ Helper: Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// ✅ TEACHER LOGIN (Normal)
const loginTeacher = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "❌ Email and password are required" });
    }

    email = email.trim();
    password = password.trim();

    // Normalize password if it's a date format
    let normalizedPassword = password;
    const date = new Date(password);
    if (!isNaN(date.getTime())) {
      normalizedPassword = date.toISOString().split("T")[0];
    }

    const teacher = await User.findOne({ email, role: "teacher" });

    if (!teacher) {
      return res.status(400).json({ message: "❌ Teacher not found" });
    }

    if (teacher.password !== normalizedPassword) {
      return res.status(400).json({ message: "⚠️ Invalid password" });
    }

    // Fetch extra details
    const teacherDetails = await Teacher.findOne({ email: teacher.email });

    // Update last login
    teacher.lastLogin = new Date();
    await teacher.save();

    const token = generateToken(teacher);

    res.status(200).json({
      message: "✅ Login successful",
      token,
      teacher: {
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
        year: teacherDetails ? String(teacherDetails.year) : null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ ADMIN LOGIN (Normal)
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "❌ Email and password are required" });
    }

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(400).json({ message: "❌ Admin not found" });
    }

    if (admin.password !== password) {
      return res.status(400).json({ message: "⚠️ Invalid password" });
    }

    const token = generateToken(admin);

    res.status(200).json({
      message: "✅ Login successful",
      token,
      teacher: {
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ PARENT LOGIN (Normal)
const loginParent = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "❌ Email and password are required" });
    }

    email = email.trim();
    password = password.trim();

    const parent = await User.findOne({ email, role: "parent" });

    if (!parent) {
      return res.status(400).json({ message: "❌ Parent not found" });
    }

    if (parent.password !== password) {
      return res.status(400).json({ message: "⚠️ Invalid password" });
    }

    parent.lastLogin = new Date();
    await parent.save();

    const token = generateToken(parent);

    res.status(200).json({
      message: "✅ Login successful",
      token,
      parent: {
        name: parent.name,
        email: parent.email,
        role: parent.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GOOGLE LOGIN (OAuth2)
const googleLogin = async (req, res) => {
  try {
    const { token, role } = req.body;

    if (!token || !role) {
      return res.status(400).json({ message: "❌ Google token and role are required" });
    }

    // Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    // Check if user exists, else create new
    let user = await User.findOne({ email, role });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: "google-auth",
        role,
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT
    const jwtToken = generateToken(user);

    res.status(200).json({
      message: "✅ Google Login successful",
      token: jwtToken,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(400).json({ message: "❌ Google login failed" });
  }
};

module.exports = {
  loginTeacher,
  adminLogin,
  loginParent,
  googleLogin,
};
