const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Drive = require("../models/Drive");
// Storage for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const deptFilter = req.query.department;
    const userRole = req.headers['x-user-role'];
    const userEmail = req.headers['x-user-email'];
    const AssignedStudent = require("../models/AssignedStudent");
    const Student = require("../models/Student");
    let query = {};

    if (userRole === 'teacher') {
      query.teacherEmail = userEmail;
    }
    // Parents can view all drives

    if (deptFilter && deptFilter !== "All") {
      query.departments = deptFilter;
    }

    const drives = await Drive.find(query).sort({ createdAt: -1 });
    res.json(drives);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new drive
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { name, date, departments } = req.body;
    const departmentsArray = departments.split(",").map((d) => d.trim());
    const teacherEmail = req.headers['x-user-email'];

    const newDrive = await Drive.create({
      name,
      date,
      departments: departmentsArray,
      file: `/uploads/${req.file.filename}`,
      teacherEmail,
    });

    res.json(newDrive);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Drive.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
