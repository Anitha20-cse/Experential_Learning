const Student = require("../models/Student");
const Skillrack = require("../models/Skillrack");
const AssignedStudent = require("../models/AssignedStudent");
const Teacher = require("../models/Teacher");

// Helper function to transform skillrack data to expected field names
const transformSkillrackData = (data) => {
  return data.map(item => {
    const obj = item.toObject ? item.toObject() : item;
    // Get all keys from the object
    const allKeys = Object.keys(obj);
    console.log('All keys in object:', allKeys); // Debug log

    // Static fields
    const transformed = {
      regNo: obj.RegNo || obj.regNo,
      name: obj.Name || obj.name,
    };

    // Dynamic fields - map any field that contains month names
    allKeys.forEach(key => {
      if (key.includes('July') || key.includes('August') || key.includes('September')) {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('medal')) {
          if (lowerKey.includes('july')) transformed.medalJuly = obj[key];
          else if (lowerKey.includes('august')) transformed.medalAugust = obj[key];
          else if (lowerKey.includes('september')) transformed.medalSeptember = obj[key];
        } else if (lowerKey.includes('dc') || lowerKey.includes('dt')) {
          if (lowerKey.includes('july')) transformed.dcJuly = obj[key];
          else if (lowerKey.includes('august')) transformed.dcAugust = obj[key];
          else if (lowerKey.includes('september')) transformed.dcSeptember = obj[key];
        } else if (lowerKey.includes('leetcode')) {
          if (lowerKey.includes('july')) transformed.leetcodeJuly = obj[key];
          else if (lowerKey.includes('august')) transformed.leetcodeAugust = obj[key];
          else if (lowerKey.includes('september')) transformed.leetcodeSeptember = obj[key];
        }
      }
    });

    return transformed;
  });
};

// Get skillrack data for parent: child's data and top coders from assigned teachers
const getSkillrackForParent = async (req, res) => {
  try {
    const parentEmail = req.headers['x-user-email'];
    if (!parentEmail) {
      return res.status(400).json({ message: "Parent email not provided" });
    }

    // Find students for this parent
    const students = await Student.find({ parentEmail });
    if (students.length === 0) {
      return res.status(404).json({ message: "No students found for this parent" });
    }

    const studentRegNos = students.map(s => s.rollNo);

    // Get child's skillrack data
    const rawChildData = await Skillrack.find({ regNo: { $in: studentRegNos } });
    const childData = transformSkillrackData(rawChildData);

    // Find assigned teachers for these students
    const assignments = await AssignedStudent.find({
      student: { $in: students.map(s => s._id) }
    }).populate('teacher');

    const teacherIds = [...new Set(assignments.map(a => a.teacher._id))];

    // Get top coders from these teachers (including child's data if applicable)
    const rawTeacherSkillrackData = await Skillrack.find({
      teacher: { $in: teacherIds }
    }).populate('teacher', 'name');

    // Sort by total medals (using transformed fields)
    const sortedTopCoders = transformSkillrackData(rawTeacherSkillrackData)
      .map(item => ({
        ...item,
        totalMedals: (parseInt(item.medalJuly || 0) + parseInt(item.medalAugust || 0) + parseInt(item.medalSeptember || 0))
      }))
      .sort((a, b) => b.totalMedals - a.totalMedals)
      .slice(0, 3); // Top 3

    res.json({
      childData,
      topCoders: sortedTopCoders
    });
  } catch (err) {
    console.error("Error fetching skillrack data for parent:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get medals for selected students (existing function)
const getSkillrackMedals = async (req, res) => {
  try {
    const names = ["Priya", "Ravi", "Sneha", "Tanu", "Varun"];
    const students = await Student.find({ studentName: { $in: names } });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update medals if needed
const updateMedals = async (req, res) => {
  try {
    const { name, medals } = req.body;

    const student = await Student.findOneAndUpdate(
      { studentName: name },
      { medals },
      { new: true }
    );

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSkillrackForParent, getSkillrackMedals, updateMedals };
