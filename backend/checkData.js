const mongoose = require('mongoose');
const Attendance = require('./models/Attendance');
const Student = require('./models/Student');

async function checkData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/college', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Check total attendance records
    const attendanceCount = await Attendance.countDocuments();
    console.log('Total attendance records:', attendanceCount);

    // Check sample attendance records
    const attendanceRecords = await Attendance.find().limit(5);
    console.log('Sample attendance records:');
    attendanceRecords.forEach((record, index) => {
      console.log(`${index + 1}. RollNo: ${record.rollNo}, Name: ${record.name}, Type: ${record.type}`);
    });

    // Check total students
    const studentCount = await Student.countDocuments();
    console.log('Total students:', studentCount);

    // Check sample students
    const students = await Student.find().limit(5);
    console.log('Sample students:');
    students.forEach((student, index) => {
      console.log(`${index + 1}. RollNo: ${student.rollNo}, Name: ${student.firstName} ${student.lastName}, ParentEmail: ${student.parentEmail}`);
    });

    // Check if there are students with parentEmail
    const studentsWithParentEmail = await Student.find({ parentEmail: { $exists: true, $ne: null } }).limit(5);
    console.log('Students with parentEmail:');
    studentsWithParentEmail.forEach((student, index) => {
      console.log(`${index + 1}. RollNo: ${student.rollNo}, ParentEmail: ${student.parentEmail}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkData();
