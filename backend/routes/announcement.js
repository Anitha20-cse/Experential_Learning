const express = require("express");
const router = express.Router();
const Announcement = require("../models/announcement");
const Student = require("../models/Student");
const AssignedStudent = require("../models/AssignedStudent");

// ✅ Get all announcements (with optional search & date filter)
router.get("/", async (req, res) => {
  try {
    const { search, date } = req.query;
    const userRole = req.headers['x-user-role'];
    const userEmail = req.headers['x-user-email'];
    const query = {};

    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { content: new RegExp(search, "i") },
      ];
    }

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    if (userRole === 'teacher') {
      query.teacherEmail = userEmail;
    } else if (userRole === 'parent') {
      // Find parent's children
      const children = await Student.find({ parentEmail: userEmail });
      const childIds = children.map(c => c._id);

      // Find teachers assigned to those children
      const assignments = await AssignedStudent.find({ student: { $in: childIds } }).populate('teacher');
      const teacherEmails = assignments.filter(a => a.teacher).map(a => a.teacher.email);

      // Filter announcements to only include those by child's teachers
      query.teacherEmail = { $in: teacherEmails };
    }

    const announcements = await Announcement.find(query).sort({ date: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create new
router.post("/", async (req, res) => {
  try {
    const newAnnouncement = new Announcement(req.body);
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update
router.put("/:id", async (req, res) => {
  try {
    const updated = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete
router.delete("/:id", async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
