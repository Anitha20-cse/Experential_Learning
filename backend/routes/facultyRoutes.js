const express = require("express");
const { getFacultyPhoto, getFacultyPhotos } = require("../controllers/facultyController");

const router = express.Router();

// Get faculty photo by name and department
router.get("/photo/:facultyName/:department", getFacultyPhoto);

// Get all faculty photos
router.get("/photos", getFacultyPhotos);

module.exports = router;