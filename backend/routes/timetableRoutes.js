// routes/timetableRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const Timetable = require("../models/Timetable");
const AssignedStudent = require("../models/AssignedStudent");
const Student = require("../models/Student");

const router = express.Router();

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/timetables"); // save in /uploads/timetables/
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique name
  },
});

const upload = multer({ storage });

// Serve the uploaded files statically
router.use("/uploads/timetables", express.static("uploads/timetables"));

// ✅ Get all timetables
router.get("/", async (req, res) => {
  try {
    const userRole = req.headers["x-user-role"];
    const userEmail = req.headers["x-user-email"];
    let query = {};

    if (userRole === "teacher") {
      query.teacherEmail = userEmail;
    } else if (userRole === "parent") {
      const User = require("../models/User");
      const parentUser = await User.findOne({ email: userEmail, role: "parent" });
      if (!parentUser) return res.status(404).json({ message: "Parent not found" });

      const students = await Student.find({ parentEmail: userEmail });
      const studentIds = students.map((s) => s._id);
      const assignments = await AssignedStudent.find({ student: { $in: studentIds } }).populate("teacher");
      const teacherEmails = [...new Set(assignments.map((a) => a.teacher.email))];
      query.teacherEmail = { $in: teacherEmails };
    }
const timetableType = req.headers["x-timetable-type"];
if (timetableType) {
  query.type = timetableType;
}
const timetables = await Timetable.find(query);

    res.json(timetables);
  } catch (error) {
    res.status(500).json({ message: "Error fetching timetables" });
  }
});

// ✅ Add new timetable (with file upload)
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const userRole = req.headers["x-user-role"];
    const userEmail = req.headers["x-user-email"];
    if (userRole !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    const newTimetable = new Timetable({
      semester: req.body.semester,
      imageUrl: `/uploads/timetables/${req.file.filename}`,
      teacherEmail: userEmail,
      type: req.body.type || 'regular', // Add type field
    });

    await newTimetable.save();
    res.status(201).json(newTimetable);
  } catch (error) {
    res.status(400).json({ message: "Error adding timetable" });
  }
});

// ✅ Delete single timetable
router.delete("/:id", async (req, res) => {
  try {
    const userRole = req.headers["x-user-role"];
    if (userRole !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }
    await Timetable.findByIdAndDelete(req.params.id);
    res.json({ message: "Timetable deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting timetable" });
  }
});

// ✅ Delete all timetables for that teacher
router.delete("/", async (req, res) => {
  try {
    const userRole = req.headers["x-user-role"];
    const userEmail = req.headers["x-user-email"];
    if (userRole !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }
    await Timetable.deleteMany({ teacherEmail: userEmail });
    res.json({ message: "All timetables deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting all timetables" });
  }
});

module.exports = router;