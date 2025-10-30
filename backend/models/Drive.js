const mongoose = require("mongoose");

const driveSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },       // Company name
    departments: [{ type: String, required: true }], // e.g., ["CSE", "IT"]
    date: { type: Date, required: true },
    file: { type: String, required: true },
    teacherEmail: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Drive", driveSchema);
