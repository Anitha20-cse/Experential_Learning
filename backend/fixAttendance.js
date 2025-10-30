const mongoose = require("mongoose");
const Attendance = require("./models/Attendance");

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/yourDatabaseName", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const fixAttendance = async () => {
  try {
    const resultStatus = await Attendance.updateMany(
      { $or: [{ status: { $exists: false } }, { status: null }, { status: "" }] },
      { $set: { status: "Absent" } }
    );

    const resultDate = await Attendance.updateMany(
      { $or: [{ date: { $exists: false } }, { date: null }, { date: "" }] },
      { $set: { date: new Date() } }
    );

    console.log("🌱 Status updated:", resultStatus.modifiedCount);
    console.log("🌱 Date updated:", resultDate.modifiedCount);

    console.log("✅ Attendance data fixed successfully!");
  } catch (err) {
    console.error("❌ Error fixing attendance:", err);
  } finally {
    mongoose.connection.close();
  }
};

fixAttendance();
