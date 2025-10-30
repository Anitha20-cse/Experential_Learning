const Timetable = require("../models/Timetable");

// GET all timetables
const getTimetables = async (req, res) => {
  try {
    const userRole = req.headers['x-user-role'];
    const userEmail = req.headers['x-user-email'];
    const query = {};

    if (userRole === 'parent') {
      // Find parent's children
      const children = await require("../models/Student").find({ parentEmail: userEmail });
      const childIds = children.map(c => c._id);

      // Find teachers assigned to those children
      const assignments = await require("../models/AssignedStudent").find({ student: { $in: childIds } }).populate('teacher');
      const teacherEmails = assignments.filter(a => a.teacher).map(a => a.teacher.email);

      // Filter timetables to only include those by child's teachers
      query.teacherEmail = { $in: teacherEmails };
    } else if (userRole === 'teacher') {
      // Filter timetables to only include those by the logged-in teacher
      query.teacherEmail = userEmail;
    }

    const timetables = await Timetable.find(query);
    res.json(timetables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST (add new timetable)
const addTimetable = async (req, res) => {
  try {
    const newTimetable = new Timetable(req.body);
    await newTimetable.save();
    res.status(201).json(newTimetable);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getTimetables, addTimetable };