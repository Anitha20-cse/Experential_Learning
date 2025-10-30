const express = require("express");
const router = express.Router();

// Import all controllers
const {
  loginTeacher,
  adminLogin,
  loginParent,
  googleLogin
} = require("../controllers/authController");

// ✅ Existing Normal Login Routes (Unchanged)
router.post("/teacher/login", loginTeacher);
router.post("/admin/login", adminLogin);
router.post("/parent/login", loginParent);

// ✅ New Google OAuth Login Route (Common for all roles)
router.post("/google/login", googleLogin);

module.exports = router;
