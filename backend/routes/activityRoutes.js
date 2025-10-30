// routes/activityRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const Activity = require("../models/Activity");
const Student = require("../models/Student");
const AssignedStudent = require("../models/AssignedStudent");

const router = express.Router();

// ✅ Storage config for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // store in /uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Add new activity
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, date, description } = req.body;
    const teacherEmail = req.headers['x-user-email'];
    const newActivity = new Activity({
      title,
      date,
      description,
      image: req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : null,
      teacherEmail,
    });
    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// DELETE activity
router.delete("/:id", async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Activity deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all activities
router.get("/", async (req, res) => {
  try {
    const userRole = req.headers['x-user-role'];
    const userEmail = req.headers['x-user-email'];
    const query = {};

    if (userRole === 'teacher') {
      query.teacherEmail = userEmail;
    } else if (userRole === 'parent') {
      // Find parent's children
      const children = await Student.find({ parentEmail: userEmail });
      const childIds = children.map(c => c._id);

      // Find teachers assigned to those children
      const assignments = await AssignedStudent.find({ student: { $in: childIds } }).populate('teacher');
      const teacherEmails = assignments.map(a => a.teacher.email);

      // Filter activities to only include those by child's teachers
      query.teacherEmail = { $in: teacherEmails };
    }

    const activities = await Activity.find(query).sort({ date: -1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
