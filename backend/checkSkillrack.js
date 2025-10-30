const mongoose = require('mongoose');
const Skillrack = require('./models/Skillrack');
const Student = require('./models/Student');
const connectDB = require('./config/db');
require('dotenv').config();

async function checkSkillrack() {
  try {
    await connectDB();

    console.log('Connected to MongoDB');

    const skillrackCount = await Skillrack.countDocuments();
    console.log('Total Skillrack records:', skillrackCount);

    const skillrackData = await Skillrack.find().limit(5);
    console.log('Sample Skillrack data:');
    skillrackData.forEach((record, index) => {
      console.log(`${index + 1}. RegNo: ${record.regNo}, Name: ${record.name}, Teacher: ${record.teacher}`);
    });

    const studentsWithParentEmail = await Student.find({ parentEmail: { $exists: true, $ne: null } }).limit(5);
    console.log('Students with parentEmail:');
    studentsWithParentEmail.forEach((student, index) => {
      console.log(`${index + 1}. RollNo: ${student.rollNo}, ParentEmail: ${student.parentEmail}`);
    });

    // Check if skillrack has regNo matching student rollNo
    const students = await Student.find().limit(10);
    const studentRegNos = students.map(s => s.rollNo);
    const matchingSkillrack = await Skillrack.find({ regNo: { $in: studentRegNos } });
    console.log('Skillrack records matching student regNos:', matchingSkillrack.length);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkSkillrack();
