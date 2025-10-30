const AssignedStudent = require("../models/AssignedStudent");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

const mongoose = require("mongoose");
const XLSX = require('xlsx');
const fs = require('fs');

// Fetch all students optionally filtered by department and year, excluding already assigned students
exports.getStudents = async (req, res) => {
  try {
    const { department, year } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (year) filter.year = Number(year);

    // Find assigned student IDs for the given department and year
    const assignedStudents = await AssignedStudent.find({
      department,
      year: Number(year),
    }).select("student");

    const assignedStudentIds = assignedStudents.map(a => a.student);

    // Fetch students excluding assigned ones
    const students = await Student.find({
      ...filter,
      _id: { $nin: assignedStudentIds },
    });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
};

// Fetch all teachers optionally filtered by department
exports.getTeachers = async (req, res) => {
  try {
    const { department } = req.query;
    const filter = {};
    if (department) filter.department = department;

    const teachers = await Teacher.find(filter);
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching teachers", error });
  }
};

// Assign a teacher to multiple students
exports.assignTeacherToStudent = async (req, res) => {
  try {
    const { studentIds, teacherId, department, year } = req.body;
    const file = req.file;

    console.log("Received assign request body:", req.body);

    if (!teacherId) {
      console.log("Validation failed: teacherId missing");
      return res.status(400).json({ message: "Missing teacherId" });
    }
    if (!department) {
      console.log("Validation failed: department missing");
      return res.status(400).json({ message: "Missing department" });
    }
    if (!year) {
      console.log("Validation failed: year missing");
      return res.status(400).json({ message: "Missing year" });
    }

    let studentIdsArray = [];
    if (studentIds) {
      try {
        studentIdsArray = JSON.parse(studentIds);
      } catch (e) {
        studentIdsArray = [];
      }
    }

    let allStudentIds = studentIdsArray;

    // Process Excel file if provided
    if (file) {
      try {
        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validate columns
        if (jsonData.length === 0) {
          return res.status(400).json({ message: "Excel file is empty" });
        }
        const firstRow = jsonData[0];
        if (!firstRow.RegistrationNo || !firstRow.StudentName) {
          return res.status(400).json({ message: "Excel file must have 'RegistrationNo' and 'StudentName' columns" });
        }

        // Process each row
        for (const row of jsonData) {
          const regNo = row.RegistrationNo?.toString().trim();
          const studentName = row.StudentName?.toString().trim();

          if (!regNo || !studentName) {
            return res.status(400).json({ message: "Invalid data in row: RegistrationNo and StudentName are required" });
          }

          // Check if student exists
          let student = await Student.findOne({ rollNo: regNo });
          if (!student) {
            // Create new student
            const nameParts = studentName.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            student = new Student({
              rollNo: regNo,
              firstName,
              lastName,
              department,
              year: Number(year),
            });
            await student.save();
          }

          // Add to list if not already present
          if (!allStudentIds.includes(student._id.toString())) {
            allStudentIds.push(student._id.toString());
          }
        }

        // Clean up uploaded file
        fs.unlinkSync(file.path);
      } catch (error) {
        console.error('Error processing Excel file:', error);
        return res.status(400).json({ message: "Invalid file format or structure" });
      }
    }

    if (allStudentIds.length === 0) {
      return res.status(400).json({ message: "No students selected or uploaded" });
    }

    const assignments = [];
    const existingAssignments = [];

    for (const studentId of allStudentIds) {
      // Check if assignment already exists
      const existingAssignment = await AssignedStudent.findOne({
        student: studentId,
        teacher: teacherId,
      });

      if (existingAssignment) {
        existingAssignments.push(studentId);
        continue;
      }

      const assignment = new AssignedStudent({
        student: studentId,
        teacher: teacherId,
        department,
        year,
      });

      await assignment.save();
      assignments.push(assignment);
    }

    let message = `${assignments.length} student(s) assigned to teacher successfully`;
    if (existingAssignments.length > 0) {
      message += `. ${existingAssignments.length} assignment(s) already existed and were skipped.`;
    }

    res.status(201).json({ message, assignments, skipped: existingAssignments });
  } catch (error) {
    res.status(500).json({ message: "Error assigning students to teacher", error });
  }
};

// List all assignments with populated student and teacher details, optionally filtered by department and year
exports.listAssignments = async (req, res) => {
  try {
    const { department, year } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (year) filter.year = Number(year);

    const assignments = await AssignedStudent.find(filter)
      .populate("student")
      .populate("teacher");
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignments", error });
  }
};

// Get parent profile including student and assigned teacher details
exports.getParentProfile = async (req, res) => {
  try {
    const parentEmail = req.query.parentEmail;
    if (!parentEmail) {
      return res.status(400).json({ message: "Missing parentEmail query parameter" });
    }

    // Find student(s) for the parent
    const students = await Student.find({ parentEmail });

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found for this parent" });
    }

    // For each student, find assigned teacher
    const studentProfiles = await Promise.all(students.map(async (student) => {
      const assignment = await AssignedStudent.findOne({ student: student._id }).populate('teacher');
      return {
        studentName: `${student.firstName} ${student.lastName}`,
        studentEmail: student.emailId,
        regno: student.rollNo,
        year: student.year,
        teacherName: assignment?.teacher?.name || 'Not assigned',
        teacherEmail: assignment?.teacher?.email || 'N/A',
      };
    }));

    res.status(200).json(studentProfiles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching parent profile", error });
  }
};



// Get students assigned to a specific teacher
exports.getStudentsForTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const assignments = await AssignedStudent.find({ teacher: teacherId })
      .populate("student")
      .populate("teacher");
    const students = assignments.map(assignment => assignment.student).filter(s => s);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students for teacher", error });
  }
};

// Update an assignment (change teacher)
exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacherId } = req.body;

    if (!teacherId) {
      return res.status(400).json({ message: "Missing teacherId" });
    }

    const updatedAssignment = await AssignedStudent.findByIdAndUpdate(
      id,
      { teacher: teacherId },
      { new: true }
    ).populate("student").populate("teacher");

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({ message: "Assignment updated successfully", assignment: updatedAssignment });
  } catch (error) {
    res.status(500).json({ message: "Error updating assignment", error });
  }
};

// Delete an assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAssignment = await AssignedStudent.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting assignment", error });
  }
};