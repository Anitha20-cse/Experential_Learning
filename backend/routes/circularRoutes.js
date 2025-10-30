const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Circular = require("../models/Circular");

// File upload storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  }
});

// GET all circulars
router.get("/", async (req, res) => {
  try {
    const circulars = await Circular.find().sort({ createdAt: -1 });
    res.json(circulars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new circular
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, description, semester, category } = req.body;
    const circular = await Circular.create({
      title,
      description,
     
      category,
      file: req.file ? `/uploads/${req.file.filename}` : null,
    });
    res.json(circular);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE circular
router.delete("/:id", async (req, res) => {
  try {
    await Circular.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
