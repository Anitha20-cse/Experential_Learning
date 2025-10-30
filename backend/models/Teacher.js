const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true },
    experience: { type: Number, required: true },
    phone: { type: String, required: true },
    photo: { type: String },
    year: { type: String },
    gender: { type: String },
    dateOfBirth: { type: Date },
    email: { type: String },
    address: { type: String },
    qualification: { type: String },
    specialisation: { type: String },
    department: { type: String, required: true },
    dateOfJoining: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);
