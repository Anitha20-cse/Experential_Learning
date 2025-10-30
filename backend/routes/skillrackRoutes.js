// routes/skillrackRoutes.js
const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const Skillrack = require("../models/Skillrack");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

    console.log("✅ Parsed Excel Data:", jsonData.slice(0, 2));

    // Get teacher ID from headers (assuming teacher is logged in when uploading)
    const teacherId = req.headers['x-user-id']; // Assuming teacher ID is passed in headers

    // Add teacher reference to each data entry
    const dataWithTeacher = jsonData.map(item => ({
      ...item,
      teacher: teacherId // Add teacher reference
    }));

    // Store directly into DB
    await Skillrack.insertMany(dataWithTeacher);

    res.json({ message: "Skillrack data uploaded successfully ✅", count: jsonData.length });
  } catch (err) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({ message: "Error uploading skillrack data", error: err.message });
  }
});

const { getSkillrackForParent } = require("../controllers/skillrackController");

router.get("/", async (req, res) => {
  try {
    const userRole = req.headers['x-user-role'];
    const userEmail = req.headers['x-user-email'];

    if (userRole === 'parent' && userEmail) {
      return getSkillrackForParent(req, res);
    } else {
      // Default behavior for other roles (e.g., admin)
      const skillrackData = await Skillrack.find();
      res.json(skillrackData);
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching skillrack data" });
  }
});

router.delete("/", async (req, res) => {
  try {
    await Skillrack.deleteMany({});
    res.json({ message: "All skillrack data deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;