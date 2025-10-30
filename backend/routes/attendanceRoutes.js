const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const multer = require("multer");
const xlsx = require("xlsx");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Helper function to get month index
function getMonthIndex(monthName) {
  const months = {
    'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
    'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
  };
  return months[monthName] || 0;
}

// GET all
router.get("/", async (req, res) => {
  try {
    const userRole = req.headers['x-user-role'];
    const userEmail = req.headers['x-user-email'];

    console.log('User Role:', userRole);
    console.log('User Email:', userEmail);

    let data = await Attendance.find();
    console.log('Total attendance records found:', data.length);

    if (userRole === 'parent') {
      // Find parent's children
      const children = await Student.find({ parentEmail: userEmail });
      console.log('Children found for parent:', children.length);
      console.log('Children rollNos:', children.map(c => c.rollNo));

      const childRollNos = children.map(c => c.rollNo);

      // Filter attendance data to only include parent's children
      data = data.filter(a => childRollNos.includes(a.rollNo));
      console.log('Filtered attendance records:', data.length);
    }

    res.json(data);
  } catch (err) {
    console.error('Error fetching attendance data:', err);
    res.status(500).json({ message: "Error fetching attendance data" });
  }
});

// POST new
router.post("/", async (req, res) => {
  const { name, rollNo, status, date } = req.body;
  const newStudent = new Attendance({ name, rollNo, status, date });
  await newStudent.save();
  res.json(newStudent);
});

// PUT update
router.put("/:id", async (req, res) => {
  const { name, rollNo, status, date } = req.body;
  const updated = await Attendance.findByIdAndUpdate(
    req.params.id,
    { name, rollNo, status, date },
    { new: true }
  );
  res.json(updated);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Attendance.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// DELETE all attendance records (teacher only)
router.delete("/", async (req, res) => {
  try {
    const userRole = req.headers['x-user-role'];
    if (userRole !== 'teacher') {
      return res.status(403).json({ message: "Access denied. Only teachers can delete all records." });
    }

    const result = await Attendance.deleteMany({});
    res.json({
      message: "All attendance records deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting all attendance records" });
  }
});

// Upload dynamic attendance
router.post("/upload", upload.single('file'), async (req, res) => {
  try {
    const teacherEmail = req.headers['x-user-email'];
    const { type, month, year } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    if (!jsonData || jsonData.length === 0) {
      return res.status(400).json({ message: "No data found in the Excel file" });
    }

    const attendanceRecords = [];

    jsonData.forEach(row => {
      // Get the first column as Reg No and second column as Name
      const keys = Object.keys(row);
      const regNoKey = keys[0]; // First column is Reg No
      const nameKey = keys[1];  // Second column is Name

      if (regNoKey && nameKey) {
        const rollNo = row[regNoKey];
        const name = row[nameKey];

        if (name && rollNo) {
          const dynamicFields = {};

          // Store all columns except the first two (Reg No and Name) in dynamicFields
          keys.slice(2).forEach(key => {
            dynamicFields[key] = row[key];
          });

          attendanceRecords.push({
            name: name.toString(),
            rollNo: rollNo.toString(),
            dynamicFields,
            teacherEmail,
            type: type || 'consolidated',
            month: type === 'month-wise' ? month : undefined,
            year: type === 'month-wise' ? parseInt(year) : undefined
          });
        }
      }
    });

    console.log('Parsed attendance records:', attendanceRecords.length);
    if (attendanceRecords.length > 0) {
      console.log('Sample record:', attendanceRecords[0]);
    }
    console.log('JSON data keys:', jsonData.length > 0 ? Object.keys(jsonData[0]) : 'No data');

    if (attendanceRecords.length === 0) {
      return res.status(400).json({ message: "No valid attendance records found in the file" });
    }

    const inserted = await Attendance.insertMany(attendanceRecords);
    const totalCount = await Attendance.countDocuments();
    res.json({
      message: "Attendance uploaded successfully",
      count: attendanceRecords.length,
      insertedCount: inserted.length,
      totalCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading attendance: " + err.message });
  }
});



// Helper function to get month index
function getMonthIndex(monthName) {
  const months = {
    'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
    'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
  };
  return months[monthName] || 0;
}

module.exports = router;
