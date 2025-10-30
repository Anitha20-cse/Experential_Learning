const express = require("express");
const router = express.Router();
const Marks = require("../models/Marks");
const Student = require("../models/Student");
const AssignedStudent = require("../models/AssignedStudent");

// GET Top 3 Students by exam type
router.get("/top3", async (req, res) => {
  try {
    const userRole = req.headers['x-user-role'];
    const userEmail = req.headers['x-user-email'];

    let ptTop3 = [];
    let catTop3 = [];
    let endSemTop3 = [];

    if (userRole === 'teacher') {
      // Get top 3 for each exam type for the teacher
      ptTop3 = await Marks.aggregate([
        { $match: { examType: "PT", teacherEmail: userEmail } },
        {
          $group: {
            _id: { rollNo: "$rollNo", studentName: "$studentName" },
            averageMarks: { $avg: "$marks" }
          }
        },
        { $sort: { averageMarks: -1 } },
        { $limit: 3 },
        {
          $project: {
            _id: 0,
            studentName: "$_id.studentName",
            rollNo: "$_id.rollNo",
            marks: { $round: ["$averageMarks", 2] },
            examType: "PT"
          }
        }
      ]);

      catTop3 = await Marks.aggregate([
        { $match: { examType: "CAT", teacherEmail: userEmail } },
        {
          $group: {
            _id: { rollNo: "$rollNo", studentName: "$studentName" },
            averageMarks: { $avg: "$marks" }
          }
        },
        { $sort: { averageMarks: -1 } },
        { $limit: 3 },
        {
          $project: {
            _id: 0,
            studentName: "$_id.studentName",
            rollNo: "$_id.rollNo",
            marks: { $round: ["$averageMarks", 2] },
            examType: "CAT"
          }
        }
      ]);

      endSemTop3 = await Marks.aggregate([
        { $match: { examType: "End Sem", teacherEmail: userEmail } },
        {
          $group: {
            _id: { rollNo: "$rollNo", studentName: "$studentName" },
            averageMarks: { $avg: "$marks" }
          }
        },
        { $sort: { averageMarks: -1 } },
        { $limit: 3 },
        {
          $project: {
            _id: 0,
            studentName: "$_id.studentName",
            rollNo: "$_id.rollNo",
            marks: { $round: ["$averageMarks", 2] },
            examType: "End Sem"
          }
        }
      ]);
    } else if (userRole === 'parent') {
      // Find parent's children and their teachers
      const children = await Student.find({ parentEmail: userEmail });
      const childIds = children.map(c => c._id);

      const assignments = await AssignedStudent.find({ student: { $in: childIds } }).populate('teacher');
      const teacherEmails = assignments.filter(a => a.teacher).map(a => a.teacher.email);

      // Get top 3 from child's teachers
      const allMarks = await Marks.find({ teacherEmail: { $in: teacherEmails } });

      // Group by exam type and calculate averages
      const examTypes = ["PT", "CAT", "End Sem"];
      for (const examType of examTypes) {
        const filteredMarks = allMarks.filter(m => m.examType === examType);
        const studentAverages = {};

        filteredMarks.forEach(mark => {
          if (!studentAverages[mark.rollNo]) {
            studentAverages[mark.rollNo] = { studentName: mark.studentName, marks: [], count: 0 };
          }
          studentAverages[mark.rollNo].marks.push(mark.marks);
          studentAverages[mark.rollNo].count += 1;
        });

        const averages = Object.keys(studentAverages).map(rollNo => ({
          studentName: studentAverages[rollNo].studentName,
          rollNo,
          marks: studentAverages[rollNo].marks.reduce((a, b) => a + b, 0) / studentAverages[rollNo].count
        }));

        averages.sort((a, b) => b.marks - a.marks);
        const top3 = averages.slice(0, 3).map(s => ({ ...s, examType }));

        if (examType === "PT") ptTop3 = top3;
        else if (examType === "CAT") catTop3 = top3;
        else if (examType === "End Sem") endSemTop3 = top3;
      }
    }

    res.json({
      ptTop3,
      catTop3,
      endSemTop3
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
