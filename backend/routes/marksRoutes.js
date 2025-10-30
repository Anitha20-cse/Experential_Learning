const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const XLSX = require("xlsx");
const Marks = require("../models/Marks");
const Student = require("../models/Student");
const AssignedStudent = require("../models/AssignedStudent");

// File upload storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// GET marks for teacher or parent
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
      const childRollNos = children.map(c => c.rollNo);
      query.rollNo = { $in: childRollNos };
    }

    const marks = await Marks.find(query).sort({ createdAt: -1 });
    res.json(marks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST upload marks from Excel
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { examType, semester, year } = req.body;
    const teacherEmail = req.headers['x-user-email'];

    if (!req.file || path.extname(req.file.originalname) !== ".xlsx") {
      return res.status(400).json({ error: "Only XLSX files allowed!" });
    }

    // Parse Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Expected format: First row is headers, subsequent rows are data
    // Column 0: Roll No, Column 1: Student Name, Columns 2+: Subject marks
    if (data.length < 2) {
      return res.status(400).json({ error: "Excel file must have at least header row and one data row" });
    }

    const headers = data[0];
    const rollNoCol = headers.findIndex(h => h && h.toLowerCase().includes('roll'));
    const studentNameCol = headers.findIndex(h => h && h.toLowerCase().includes('student') && h.toLowerCase().includes('name'));

    if (rollNoCol === -1 || studentNameCol === -1) {
      return res.status(400).json({ error: "Excel file must have 'Roll No' and 'Student Name' columns" });
    }

    // Subject columns are from column 2 onwards
    const subjectColumns = headers.slice(2).filter(h => h && h.trim() !== '');

    const marksData = [];

    // Process each data row
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rollNo = row[rollNoCol];
      const studentName = row[studentNameCol];

      if (!rollNo || !studentName) continue; // Skip empty rows

      // For each subject column, create a mark entry
      subjectColumns.forEach((subject, subjectIndex) => {
        const marks = parseFloat(row[rollNoCol + subjectIndex + 2]); // +2 because rollNo is 0, studentName is 1
        if (!isNaN(marks)) {
          marksData.push({
            studentName: studentName.toString().trim(),
            rollNo: rollNo.toString().trim(),
            subject: subject.toString().trim(),
            marks,
            examType,
            teacherEmail,
            semester: parseInt(semester),
            year: parseInt(year),
          });
        }
      });
    }

    if (marksData.length === 0) {
      return res.status(400).json({ error: "No valid marks data found in Excel file" });
    }

    // Insert marks
    await Marks.insertMany(marksData);

    res.json({ message: `Marks uploaded successfully! ${marksData.length} records added.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET top students by exam type for teacher
router.get("/top-students/:examType", async (req, res) => {
  try {
    const { examType } = req.params;
    const teacherEmail = req.headers['x-user-email'];

    // Aggregate average marks per student per exam type
    const topStudents = await Marks.aggregate([
      { $match: { examType, teacherEmail } },
      {
        $group: {
          _id: { rollNo: "$rollNo", studentName: "$studentName" },
          averageMarks: { $avg: "$marks" }
        }
      },
      { $sort: { averageMarks: -1 } },
      { $limit: 3 },
      {
        $project: {
          _id: 0,
          studentName: "$_id.studentName",
          rollNo: "$_id.rollNo",
          averageMarks: { $round: ["$averageMarks", 2] }
        }
      }
    ]);

    res.json(topStudents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET child's marks for parent
router.get("/child-marks", async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'];

    // Find parent's children
    const children = await Student.find({ parentEmail: userEmail });
    const childRollNos = children.map(c => c.rollNo);

    const marks = await Marks.find({ rollNo: { $in: childRollNos } }).sort({ examType: 1, subject: 1 });
    res.json(marks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
