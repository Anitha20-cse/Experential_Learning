const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const User = require("./models/User");
const teacherDashboardRoutes = require("./routes/teacherDashboardRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const skillrackRoutes = require("./routes/skillrackRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const announcementRoutes = require("./routes/announcement");
const examRoutes = require("./routes/examRoutes");
const activityRoutes = require("./routes/activityRoutes");
const driveRoutes = require("./routes/driveRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const path = require("path");
const circularRoutes = require("./routes/circularRoutes");
const addstudentRoutes = require("./routes/addstudent"); // ⬅️ NEW
const teacherRoutes = require("./routes/teacherRoutes"); // ⬅️ ADD THIS AT THE TOP
const assignedStudentRoutes = require("./routes/assignedStudentRoutes");
const cbcsRoutes = require("./routes/cbcsRoutes"); //
const marksRoutes = require("./routes/marksRoutes");
const leaveRequestRoutes = require("./routes/leaveRequestRoutes");
const facultyRoutes = require("./routes/facultyRoutes"); // ⬅ ADD FACULTY ROUTES
const scholarshipRoutes = require("./routes/scholarshipRoutes"); // ⬅ ADD SCHOLARSHIP ROUTES
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Global request logger middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Log request body for parent login to debug undefined body issue
app.use("/api/auth/parent/login", (req, res, next) => {
  console.log("Request to /api/auth/parent/login with body:", req.body);
  next();
});

app.use("/api/drives", driveRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/cbcs", cbcsRoutes); // ⬅️ ADD CBCS ROUTES
// Connect Database
connectDB();

// Log request body for teacher login to debug 400 error
app.use("/api/auth/teacher/login", (req, res, next) => {
  console.log("Request to /api/auth/teacher/login with body:", req.body);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/skillrack", skillrackRoutes);
app.use("/api/dashboard", teacherDashboardRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/drives", driveRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/students", addstudentRoutes);
app.use("/api/teachers", teacherRoutes); // ⬅️ ADD THIS
app.use("/api/assigned-students", assignedStudentRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/leave-requests", leaveRequestRoutes);
app.use("/api/scholarships", scholarshipRoutes); // ⬅ ADD SCHOLARSHIP ROUTES
app.use("/api/cbcs", cbcsRoutes); // ⬅ ADD CBCS ROUTES
app.use("/api/faculty", facultyRoutes); // ⬅ ADD FACULTY ROUTES
app.use("/api/circulars", circularRoutes);
// Seed Admin User
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "nive12@gmail.com" });
    if (!adminExists) {
      await User.create({
        name: "nivetha",
        email: "nive12@gmail.com",
        password: "nivethanive@2006", // plain text password
        role: "admin",
      });
      console.log("✅ Admin user created: nive12@gmail.com / nivethanive@2006");
    } else {
      console.log("ℹ Admin user already exists");
    }
  } catch (err) {
    console.error("❌ Error seeding admin:", err.message);
  }
};
seedAdmin();

// Test Route
app.get("/", (req, res) => {
  res.send("Backend + MongoDB is running ✅");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
