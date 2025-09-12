const express = require("express"); 
const router = express.Router(); 

const { loginTeacher, adminLogin } = require("../controllers/authController");

// Teacher login
router.post("/teacher/login", loginTeacher);
router.post("/admin/login",adminLogin);

module.exports = router;
