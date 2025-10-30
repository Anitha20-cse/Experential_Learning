const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Rank = require("./models/Rank"); // Adjust path if needed

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

const seedStudents = async () => {
  await connectDB();

 const students = [
  { studentName: "Aarthi", rollNo: "2312078", marks: 0.9 },
  { studentName: "Bharath", rollNo: "2312089", marks: 9.2 },
  { studentName: "Chitra", rollNo: "2312100", marks: 8.8 },
  { studentName: "Dinesh", rollNo: "2312111", marks: 8.5 },
  { studentName: "Esha", rollNo: "2312122", marks: 8.3 },
  { studentName: "Farhan", rollNo: "2312133", marks: 8.0 },
  { studentName: "Geetha", rollNo: "2312144", marks: 7.8 },
  { studentName: "Hari", rollNo: "2312155", marks: 7.6 },
  { studentName: "Isha", rollNo: "2312166", marks: 7.4 },
  { studentName: "Jayan", rollNo: "2312177", marks: 7.0 },
  { studentName: "Karthik", rollNo: "2312188", marks: 7.0 },
  { studentName: "Lakshmi", rollNo: "2312199", marks: 6.8 },
  { studentName: "Mani", rollNo: "2312210", marks: 6.6 },
  { studentName: "Nisha", rollNo: "2312221", marks: 6.4 },
  { studentName: "Omar", rollNo: "2312232", marks: 6.2 },
  { studentName: "Priya", rollNo: "2312243", marks: 6.0 },
  { studentName: "Ravi", rollNo: "2312254", marks: 5.8 },
  { studentName: "Sneha", rollNo: "2312265", marks: 5.6 },
  { studentName: "Tanu", rollNo: "2312276", marks: 5.4 },
  { studentName: "Varun", rollNo: "2312287", marks: 5.2 }
];


  try {
    await Rank.deleteMany(); // clear existing data
    const result = await Rank.insertMany(students);
    console.log(`✅ ${result.length} students inserted`);
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding students:", err.message);
    process.exit(1);
  }
};

seedStudents();
