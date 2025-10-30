const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const Student = require("../models/Student"); // ✅ uses your Student.js model
const User = require("../models/User"); // Import User model
const router = express.Router();

// Multer setup
const upload = multer({ dest: "uploads/" });

// Upload Excel and save students
// Upload Excel and save students
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

      const workbook = xlsx.readFile(req.file.path, { cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

      console.log("📄 Raw Excel Data:", rawData);
      if (rawData.length > 0) {
        console.log("📑 First Row Keys:", Object.keys(rawData[0]));
      }

      // Convert dateOfBirth to ISO string if it's a Date object
      rawData.forEach((row, index) => {
        console.log(`Row ${index} keys:`, Object.keys(row));
      });

      // Normalize keys by trimming and lowercasing
      const normalizeKeys = (obj) => {
        const newObj = {};
        Object.keys(obj).forEach(key => {
          newObj[key.trim().toLowerCase()] = obj[key];
        });
        return newObj;
      };

      const data = rawData.map((row) => {
        const normalizedRow = normalizeKeys(row);
        let dob = normalizedRow["date_of_birth"] || normalizedRow["date of birth"] || normalizedRow["dob"] || normalizedRow["dateofbirth"];
        if (dob instanceof Date) {
          dob = dob.toISOString();
        }
        return {
          rollNo: normalizedRow["roll no"] || normalizedRow["regno"] || normalizedRow["reg no"] || normalizedRow["rollno"] || "",
          firstName: normalizedRow["first name"] || normalizedRow["firstname"] || "",
          lastName: normalizedRow["last name"] || normalizedRow["lastname"] || "",
          year: parseInt(normalizedRow["year"]) || null,
          gender: normalizedRow["gender"] || "",
          dateOfBirth: dob || "",
          bloodGroup: normalizedRow["blood group"] || normalizedRow["bloodgroup"] || "",
          phoneNumber: normalizedRow["phone number"] || normalizedRow["phonenumber"] || normalizedRow["student mobile number"] || normalizedRow["mobile number"] || "",
          emailId: normalizedRow["email"] || normalizedRow["email id"] || normalizedRow["emailid"] || "",
          permanentAddress: normalizedRow["address"] || normalizedRow["permanent address"] || normalizedRow["permanentaddress"] || "",
          fatherName: normalizedRow["father name"] || normalizedRow["fathername"] || "",
          motherName: normalizedRow["mother name"] || normalizedRow["mothername"] || "",
          parentPhone: normalizedRow["parent phone"] || normalizedRow["parentphone"] || "",
          parentEmail: normalizedRow["parent email"] || normalizedRow["parentemail"] || "",
          transportRequired: normalizedRow["transport"] || normalizedRow["transport required"] || normalizedRow["transportrequired"] || "",
          hostelRequired: normalizedRow["hostel"] || normalizedRow["hostel required"] || normalizedRow["hostelrequired"] || "",
          department: normalizedRow["department"] || "",
        };
      });

      console.log("✅ Mapped Data:", data);

      // Insert students into Student collection
      await Student.insertMany(data);

      // Create user entries for parents
      let usersCreated = 0;
      for (const student of data) {
        if (student.parentEmail && student.parentEmail.trim() && student.dateOfBirth && student.dateOfBirth.trim()) {
          // Normalize DOB to YYYY-MM-DD for password, similar to teacher
          const dobString = student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '';

          // Check if user already exists
          const existingUser = await User.findOne({ email: student.parentEmail });
          if (!existingUser) {
            const newUser = new User({
              name: student.fatherName || "Parent",
              email: student.parentEmail,
              password: dobString,
              role: "parent",
              regNo: student.rollNo,
            });
            await newUser.save();
            usersCreated++;
            console.log(`✅ Created user for parent: ${student.parentEmail}`);
          } else {
            console.log(`⚠ User already exists for: ${student.parentEmail}`);
          }
        } else {
          console.log(`⚠ Missing parentEmail or dateOfBirth for student: ${student.rollNo}, parentEmail: "${student.parentEmail}", dateOfBirth: "${student.dateOfBirth}"`);
        }
      }

      res.json({ message: "Students uploaded successfully", studentsCount: data.length, usersCreated });
    } catch (err) {
      console.error("❌ Upload Error:", err);
      res.status(500).json({ message: "Error uploading students", error: err.message });
    }
});

// Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Error fetching students" });
  }
});

// Get students by parent email
router.get("/parent/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const students = await Student.find({ parentEmail: email });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Error fetching students for parent" });
  }
});

// Get student by ID with authorization check
router.get("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const teacherEmail = req.query.teacherEmail; // Pass teacher email for authorization

    if (!teacherEmail) {
      return res.status(400).json({ message: "Teacher email required for authorization" });
    }

    // Get teacher profile to get teacher ID
    const Teacher = require("../models/Teacher");
    const teacher = await Teacher.findOne({ email: teacherEmail });
    if (!teacher) {
      return res.status(403).json({ message: "Teacher not found" });
    }

    // Check if student is assigned to this teacher
    const AssignedStudent = require("../models/AssignedStudent");
    const assignment = await AssignedStudent.findOne({
      student: studentId,
      teacher: teacher._id
    });

    if (!assignment) {
      return res.status(403).json({ message: "Access denied: Student not assigned to this teacher" });
    }

    // Fetch full student details
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).json({ message: "Error fetching student details" });
  }
});
// DELETE all students
router.delete("/", async (req, res) => {
  try {
    await Student.deleteMany({});
    res.json({ message: "All students deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;