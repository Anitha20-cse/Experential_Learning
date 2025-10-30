const mongoose = require("mongoose");
const Skillrack = require("./models/Skillrack");
const connectDB = require("./config/db");

dotenv = require("dotenv");
dotenv.config();

connectDB();

const students = [
  { studentName: "Priya", rollNo: "2312243", medals: 1200 },
  { studentName: "Ravi", rollNo: "2312254", medals: 980 },
  { studentName: "Sneha", rollNo: "2312265", medals: 750 },
  { studentName: "Tanu", rollNo: "2312276", medals: 1100 },
  { studentName: "Varun", rollNo: "2312287", medals: 890 },
  { studentName: "Aarthi", rollNo: "2312078", medals: 1350 },
  { studentName: "Bharath", rollNo: "2312089", medals: 1280 },
  { studentName: "Chitra", rollNo: "2312100", medals: 1120 },
  { studentName: "Dinesh", rollNo: "2312111", medals: 1050 },
  { studentName: "Esha", rollNo: "2312122", medals: 970 },
  { studentName: "Geetha", rollNo: "2312144", medals: 860 },
  { studentName: "Hari", rollNo: "2312155", medals: 830 },
  { studentName: "Isha", rollNo: "2312166", medals: 810 },
  { studentName: "Jayan", rollNo: "2312177", medals: 700 },
  { studentName: "Karthik", rollNo: "2312188", medals: 720 },
  { studentName: "Lakshmi", rollNo: "2312200", medals: 680 },
  { studentName: "Nisha", rollNo: "2312221", medals: 640 },
  { studentName: "Omar", rollNo: "2312232", medals: 600 }
];

const seedData = async () => {
  try {
    await Skillrack.deleteMany(); // clear existing
    await Skillrack.insertMany(students);
    console.log("✅ Skillrack data seeded successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
