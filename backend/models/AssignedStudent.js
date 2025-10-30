const mongoose = require("mongoose");

const assignedStudentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    department: { type: String, required: true },
    year: { type: Number, required: true },
  },
  { timestamps: true }
);

// Optional: Add unique index to prevent duplicate assignments
assignedStudentSchema.index({ student: 1, teacher: 1 }, { unique: true });

module.exports = mongoose.model("AssignedStudent", assignedStudentSchema);
