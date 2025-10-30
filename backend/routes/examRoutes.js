const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Exam = require("../models/Exam");
const Student = require("../models/Student");
const AssignedStudent = require("../models/AssignedStudent");

// File upload storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// GET all exams
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
      const teacherEmails = assignments.filter(a => a.teacher).map(a => a.teacher.email);

      // Filter exams to only include those by child's teachers
      query.teacherEmail = { $in: teacherEmails };
    }

    const exams = await Exam.find(query).sort({ createdAt: -1 });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new exam
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { examType, examName, startDate, semester } = req.body;
    const teacherEmail = req.headers['x-user-email'];

    // Only accept PDF
    if (req.file && path.extname(req.file.originalname) !== ".pdf") {
      return res.status(400).json({ error: "Only PDF files allowed!" });
    }

    const exam = await Exam.create({
      examType,
      examName,
      startDate,
      semester,
      file: req.file ? `/uploads/${req.file.filename}` : null,
      teacherEmail,
    });

    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE exam
router.delete("/:id", async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
