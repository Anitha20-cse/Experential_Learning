const express = require("express");
const router = express.Router();
const assignedStudentController = require("../controllers/assignedStudentController");
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });

// Route to get students filtered by department and year
router.get("/students", assignedStudentController.getStudents);

// Route to get teachers filtered by department
router.get("/teachers", assignedStudentController.getTeachers);

// Route to assign a teacher to a student
router.post("/assign", upload.single('file'), assignedStudentController.assignTeacherToStudent);

// Route to list all assignments
router.get("/assignments", assignedStudentController.listAssignments);

// Route to get students assigned to a teacher
router.get("/teacher/:teacherId", assignedStudentController.getStudentsForTeacher);

// Route to get parent profile with students and assigned teachers
router.get("/parent/profile", assignedStudentController.getParentProfile);

// Route to update an assignment
router.put("/assignments/:id", assignedStudentController.updateAssignment);

// Route to delete an assignment
router.delete("/assignments/:id", assignedStudentController.deleteAssignment);

module.exports = router;