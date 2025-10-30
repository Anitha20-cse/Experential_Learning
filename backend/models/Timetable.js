const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  semester: { type: String, required: true },
  imageUrl: { type: String, required: true },
  teacherEmail: { type: String, required: true }, // Associate with teacher
  type: { type: String, enum: ['regular', 'saturday'], default: 'regular' }, // Add type field
});

module.exports = mongoose.model("Timetable", timetableSchema);