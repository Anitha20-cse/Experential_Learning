const express = require("express"); // ✅ module
const router = express.Router();    // ✅ router

const { loginTeacher } = require("../controllers/authController");

// Teacher login
router.post("/teacher/login", loginTeacher);

module.exports = router;
