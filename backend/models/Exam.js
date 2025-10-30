const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    examType: { type: String, required: true },   // PT, CAT, Lab, End Sem
    examName: { type: String, required: true },
    startDate: { type: Date, required: true },
    semester: { type: Number, required: true },   // 1-8
    file: { type: String },                        // PDF file path
    teacherEmail: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
