const express = require("express");
const router = express.Router();
const multer = require("multer");
const Teacher = require("../models/Teacher");

// Multer storage for photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/teachers"); // folder where photos are saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Add Teacher
router.post("/add", upload.single("photo"), async (req, res) => {
  try {
    const { name, designation, experience, phone, year } = req.body;

    if (!name || !designation || !experience || !phone || !year) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const teacher = new Teacher({
      name,
      designation,
      experience,
      phone,
      year,
      department: "CSE",
      photo: req.file ? req.file.path : null,
    });

    await teacher.save();
    res.status(201).json({ message: "✅ Teacher added successfully", teacher });
  } catch (err) {
    console.error("Error adding teacher:", err);
    res.status(500).json({ error: "Failed to add teacher" });
  }
});

// ✅ Get All Teachers
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete Teacher
router.delete("/:id", async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: "Teacher deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
