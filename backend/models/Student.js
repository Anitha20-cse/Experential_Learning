const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema(
  {
    rollNo: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    year: { type: Number },
    gender: { type: String },
    dateOfBirth: { type: String },
    bloodGroup: { type: String },
    phoneNumber: { type: String },
    emailId: { type: String },
    permanentAddress: { type: String },
    fatherName: { type: String },
    motherName: { type: String },
    parentPhone: { type: String },
    parentEmail: { type: String },
    transportRequired: { type: String },
    hostelRequired: { type: String },
    department: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
