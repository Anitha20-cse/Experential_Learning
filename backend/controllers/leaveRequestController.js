const LeaveRequest = require("../models/LeaveRequest");
const Student = require("../models/Student");
const AssignedStudent = require("../models/AssignedStudent");

// Create a new leave request (Parent)
exports.createLeaveRequest = async (req, res) => {
  try {
    const { parentEmail, leaveType, reason, startDate, endDate } = req.body;

    // Find all students for this parent
    const students = await Student.find({ parentEmail });
    if (!students || students.length === 0) {
      return res.status(404).json({ error: "No students found for this parent" });
    }

    // Create leave requests for all students of this parent
    const leaveRequests = [];

    for (const student of students) {
      // Find assigned teacher
      const assignment = await AssignedStudent.findOne({ student: student._id }).populate('teacher');
      if (!assignment || !assignment.teacher) {
        continue; // Skip if no teacher assigned
      }

      const leaveRequest = new LeaveRequest({
        parentEmail,
        studentRollNo: student.rollNo,
        studentName: `${student.firstName} ${student.lastName}`,
        leaveType,
        reason,
        startDate,
        endDate,
        teacherEmail: assignment.teacher.email,
      });

      await leaveRequest.save();
      leaveRequests.push(leaveRequest);
    }

    if (leaveRequests.length === 0) {
      return res.status(404).json({ error: "No teachers assigned to your students" });
    }

    res.status(201).json({ message: "Leave requests submitted successfully", leaveRequests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get leave requests for a parent
exports.getLeaveRequestsForParent = async (req, res) => {
  try {
    const { parentEmail } = req.params;
    const leaveRequests = await LeaveRequest.find({ parentEmail }).sort({ createdAt: -1 });
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get leave requests for a teacher
exports.getLeaveRequestsForTeacher = async (req, res) => {
  try {
    const { teacherEmail } = req.params;
    const leaveRequests = await LeaveRequest.find({ teacherEmail }).sort({ createdAt: -1 });
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update leave request status (Teacher)
exports.updateLeaveRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, teacherComments } = req.body;

    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      id,
      { status, teacherComments },
      { new: true }
    );

    if (!leaveRequest) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    res.json({ message: "Leave request updated successfully", leaveRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
