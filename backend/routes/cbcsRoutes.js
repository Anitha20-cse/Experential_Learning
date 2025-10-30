const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");
const CBCS = require("../models/CBCS");
const Student = require("../models/Student");
const AssignedStudent = require("../models/AssignedStudent");
const Teacher = require("../models/Teacher");
const router = express.Router();

// Multer setup for file upload
const upload = multer({ dest: "uploads/" });

// Upload Excel and parse/display student subject allocations
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("📁 Upload request received");
    if (!req.file) {
      console.log("❌ No file uploaded");
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = req.file.originalname;
    console.log("📄 File name:", fileName);

    // Get teacher email from request body (sent from frontend)
    const teacherEmail = req.body.teacherEmail;
    if (!teacherEmail) {
      console.log("❌ No teacher email provided");
      return res.status(400).json({ message: "Teacher email is required" });
    }
    console.log("👨‍🏫 Teacher email:", teacherEmail);

    // Read the Excel file
    console.log("📖 Reading Excel file...");
    const workbook = xlsx.readFile(req.file.path, { cellDates: true });
    const subjectSheets = workbook.SheetNames;
    console.log("📋 Sheet names:", subjectSheets);

    let studentMap = {};

    // Parse faculty blocks as in your Excel format
    subjectSheets.forEach(subject => {
      console.log("🔍 Processing sheet:", subject);
      if (subject.startsWith('23CS')) {
        const ws = workbook.Sheets[subject];
        const rows = xlsx.utils.sheet_to_json(ws, { header: 1, defval: "" });
        console.log(`📊 Sheet ${subject} has ${rows.length} rows`);

        let facultyBlocks = [];
        for (let col = 0; col < rows[1]?.length; col++) {
          if (
            String(rows[1][col]).toLowerCase().includes('faculty')
            || (rows[2] && String(rows[2][col]).toLowerCase().includes('regno'))
          ) {
            facultyBlocks.push(col);
          }
        }
        console.log(`👥 Found ${facultyBlocks.length} faculty blocks in ${subject}`);

        facultyBlocks.forEach((facultyCol, idx) => {
          const facultyName = rows[1][facultyCol + 1] || "Unknown";
        console.log(`🎓 Faculty ${idx + 1}: ${facultyName} at column ${facultyCol}`);

          for (let row = 3; row < rows.length; row++) {
            const regno = rows[row][facultyCol];
            const name = rows[row][facultyCol + 1];
            if (regno && name) {
              console.log(`👨‍🎓 Student: ${regno} - ${name}`);
              // Create/update student entry in map
              if (!studentMap[regno]) {
                studentMap[regno] = { regno, name, subjects: {} };
              }
              studentMap[regno].subjects[subject] = facultyName;
            }
          }
        });
      }
    });

    // Filter students to only include those assigned to this teacher
    console.log("🔍 Filtering students for teacher:", teacherEmail);

    // Find teacher by email
    const teacher = await Teacher.findOne({ email: teacherEmail });
    if (!teacher) {
      console.log("❌ Teacher not found");
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Find assigned students for this teacher
    const assignedStudents = await AssignedStudent.find({ teacher: teacher._id }).populate('student');
    const assignedRegnos = assignedStudents.map(as => as.student.rollNo);
    console.log("📝 Assigned student regnos:", assignedRegnos);

    // Filter studentMap to only include assigned students
    const filteredStudentMap = {};
    for (const regno in studentMap) {
      if (assignedRegnos.includes(regno)) {
        filteredStudentMap[regno] = studentMap[regno];
      }
    }
    console.log("✅ Filtered students:", Object.keys(filteredStudentMap).length);

    // Prepare data for database storage (only assigned students)
    const data = [];
    for (const regno in filteredStudentMap) {
      data.push({
        sno: data.length + 1,
        regno: regno,
        name: filteredStudentMap[regno].name,
        s1: filteredStudentMap[regno].subjects['23CS51C'] || '',
        s2: filteredStudentMap[regno].subjects['23CS52C'] || '',
        s3: filteredStudentMap[regno].subjects['23CS53C'] || '',
        s4: filteredStudentMap[regno].subjects['23CS54C'] || '',
        s5: filteredStudentMap[regno].subjects['23CS55C'] || '',
        subjects: {
          s1: 'Theory of Computation',
          s2: 'Object Oriented Analysis and Design',
          s3: 'DevOps and Agile Methodology',
          s4: 'Modern Web Technologies',
          s5: 'Artificial Intelligence'
        },
        fileName: fileName,
        teacherEmail: teacherEmail
      });
    }

    console.log("✅ Mapped CBCS Data:", data);
    console.log("💾 Saving to database...");

    // Save data to database
    await CBCS.insertMany(data);

    // Remove temp file
    fs.unlinkSync(req.file.path);
    console.log("🗑 Temp file removed");

    // Return the parsed data for display
    res.json({
      message: "File uploaded and data saved successfully! Only assigned students were stored.",
      data: data,
      count: data.length,
      fileName: fileName
    });
  } catch (err) {
    console.error("❌ Upload Error:", err);
    console.error("❌ Error details:", err.stack);
    res.status(500).json({ message: "Error uploading file", error: err.message, stack: err.stack });
  }
});

// Get all CBCS data
router.get("/", async (req, res) => {
  try {
    const data = await CBCS.find();
    res.json(data);
  } catch (err) {
    console.error("❌ Fetch Error:", err);
    res.status(500).json({ message: "Error fetching data", error: err.message });
  }
});

// Get CBCS data for teacher's assigned students only
router.get("/teacher", async (req, res) => {
  try {
    const teacherEmail = req.query.teacherEmail;
    if (!teacherEmail) {
      return res.status(400).json({ message: "Missing teacherEmail query parameter" });
    }

    // Find teacher by email first
    const teacher = await Teacher.findOne({ email: teacherEmail });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Find assigned students for this teacher
    const assignedStudents = await AssignedStudent.find({ teacher: teacher._id }).populate('student');

    if (assignedStudents.length === 0) {
      return res.json([]);
    }

    // Extract regno from assigned students
    const regnos = assignedStudents.map(student => student.student.rollNo);

    // Fetch CBCS data for these regnos
    const cbcsData = await CBCS.find({ regno: { $in: regnos } });

    res.json(cbcsData);
  } catch (err) {
    console.error("❌ Fetch Teacher CBCS Error:", err);
    res.status(500).json({ message: "Error fetching CBCS data for teacher", error: err.message });
  }
});

// Delete CBCS record by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecord = await CBCS.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({ message: "CBCS record not found" });
    }

    res.json({ message: "CBCS record deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Error:", err);
    res.status(500).json({ message: "Error deleting CBCS record", error: err.message });
  }
});

// Delete all CBCS records for a teacher
router.delete("/teacher/all", async (req, res) => {
  try {
    const teacherEmail = req.query.teacherEmail;
    if (!teacherEmail) {
      return res.status(400).json({ message: "Missing teacherEmail query parameter" });
    }

    // Find teacher by email first
    const teacher = await Teacher.findOne({ email: teacherEmail });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Find assigned students for this teacher
    const assignedStudents = await AssignedStudent.find({ teacher: teacher._id }).populate('student');

    if (assignedStudents.length === 0) {
      return res.json({ message: "No assigned students found for this teacher" });
    }

    // Extract regno from assigned students
    const regnos = assignedStudents.map(student => student.student.rollNo);

    // Delete all CBCS records for these regnos
    const deleteResult = await CBCS.deleteMany({ regno: { $in: regnos } });

    res.json({
      message: `${deleteResult.deletedCount} CBCS records deleted successfully for teacher ${teacherEmail}`
    });
  } catch (err) {
    console.error("❌ Delete All Error:", err);
    res.status(500).json({ message: "Error deleting CBCS records", error: err.message });
  }
});

// Get CBCS data for parent's children
router.get("/parent", async (req, res) => {
  try {
    const parentEmail = req.query.parentEmail;
    if (!parentEmail) {
      return res.status(400).json({ message: "Missing parentEmail query parameter" });
    }

    // Find students for the parent
    const students = await Student.find({ parentEmail });

    if (students.length === 0) {
      return res.json([]);
    }

    // Extract regno from students
    const regnos = students.map(student => student.rollNo);

    // Fetch CBCS data for these regnos
    const cbcsData = await CBCS.find({ regno: { $in: regnos } });

    res.json(cbcsData);
  } catch (err) {
    console.error("❌ Fetch Parent CBCS Error:", err);
    res.status(500).json({ message: "Error fetching CBCS data for parent", error: err.message });
  }
});

module.exports = router;