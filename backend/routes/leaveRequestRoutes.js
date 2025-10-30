const express = require("express");
const router = express.Router();
const leaveRequestController = require("../controllers/leaveRequestController");

// Create a new leave request (Parent)
router.post("/", leaveRequestController.createLeaveRequest);

// Get leave requests for a parent
router.get("/parent/:parentEmail", leaveRequestController.getLeaveRequestsForParent);

// Get leave requests for a teacher
router.get("/teacher/:teacherEmail", leaveRequestController.getLeaveRequestsForTeacher);

// Update leave request status (Teacher)
router.put("/:id", leaveRequestController.updateLeaveRequestStatus);

module.exports = router;
