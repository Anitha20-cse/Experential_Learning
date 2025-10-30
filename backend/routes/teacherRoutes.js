const express = require("express");
const multer = require("multer");
const path = require("path");
const Teacher = require("../models/Teacher");
const User = require("../models/User");

const router = express.Router();

// 📂 Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage });

// ➕ Add Teacher

// Node.js/Express.js
router.post('/add', upload.single('photo'), async (req, res) => {
  try {
    const { name, designation, experience, phone, year, gender, dateOfBirth, email, address, qualification, specialisation, department, dateOfJoining } = req.body;
    const photo = req.file?.filename;

    const newTeacher = new Teacher({
      name,
      designation,
      experience,
      phone,
      year,
      gender,
      dateOfBirth,
      email,
      address,
      qualification,
      specialisation,
      department,
      dateOfJoining,
      photo,
    });

    const savedTeacher = await newTeacher.save();

    // Also create a User entry for the teacher
    const dobString = dateOfBirth ? new Date(dateOfBirth).toISOString().split('T')[0] : '';
    const newUser = new User({
      name,
      email,
      password: dobString,
      role: "teacher",
    });
    await newUser.save();

    res.json(savedTeacher); // ✅ Important: Return the saved document
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


// 📋 Get Teachers
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👤 Get Teacher Profile by Email
router.get("/profile/:email", async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ email: req.params.email });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✏️ Update Teacher
router.put("/:id", upload.single('photo'), async (req, res) => {
  try {
    const { name, designation, experience, phone, year, gender, dateOfBirth, email, address, qualification, specialisation, department, dateOfJoining } = req.body;
    const photo = req.file?.filename;

    const updateData = {
      name,
      designation,
      experience,
      phone,
      year,
      gender,
      dateOfBirth,
      email,
      address,
      qualification,
      specialisation,
      department,
      dateOfJoining,
    };

    if (photo) {
      updateData.photo = photo;
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(updatedTeacher);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// 🗑 Delete Teacher
router.delete("/:id", async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: "🗑 Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting teacher", error: error.message });
  }
});

module.exports = router;
