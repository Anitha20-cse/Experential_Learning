const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true },
  dynamicFields: { type: mongoose.Schema.Types.Mixed }, // For dynamic columns from Excel
  teacherEmail: { type: String }, // to track which teacher uploaded
  type: { type: String, enum: ['month-wise', 'consolidated'], default: 'consolidated' },
  month: { type: String },
  year: { type: Number },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Attendance", attendanceSchema);
