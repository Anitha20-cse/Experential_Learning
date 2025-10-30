const express = require("express");
const router = express.Router();
const multer = require("multer");
const Achievement = require("../models/Achievement");

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ➕ Add achievement
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { name, deptYear, eventName, eventDate, college, category, prize, cashPrize } = req.body;

    const achievement = new Achievement({
      name,
      deptYear,
      eventName,
      eventDate,
      college,
      category,
      prize,
      cashPrize,
      file: req.file ? req.file.filename : null,
    });

    await achievement.save();
    res.status(201).json(achievement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📖 Get all achievements
router.get("/", async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ createdAt: -1 });
    res.json(achievements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
