const express = require("express");
const router = express.Router();
const Scholarship = require("../models/Scholarship"); // import model

// ✅ Get all scholarships
router.get("/", async (req, res) => {
  try {
    const scholarships = await Scholarship.find();
    res.json(scholarships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Add scholarship
router.post("/", async (req, res) => {
  try {
    const scholarship = new Scholarship({
      regno: req.body.regno,
      provider: req.body.provider,
      name: req.body.name,
      type: req.body.type,
      year: req.body.year,
      status: req.body.status,
      appliedDate: req.body.appliedDate,
      amount: req.body.amount,
      description: req.body.description,
    });

    const savedScholarship = await scholarship.save();
    res.status(201).json(savedScholarship);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error saving scholarship", error: err });
  }
});

// ✅ Update scholarship
router.put("/:id", async (req, res) => {
  try {
    const updatedScholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedScholarship);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Delete scholarship
router.delete("/:id", async (req, res) => {
  try {
    await Scholarship.findByIdAndDelete(req.params.id);
    res.json({ message: "Scholarship deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;