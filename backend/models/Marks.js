const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    rollNo: { type: String, required: true },
    subject: { type: String, required: true },
    marks: { type: Number, required: true },
    examType: { type: String, required: true, enum: ["PT", "CAT", "End Sem"] },
    teacherEmail: { type: String, required: true },
    semester: { type: Number, required: true },
    year: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Marks", marksSchema);
