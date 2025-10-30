// models/Rank.js
const mongoose = require("mongoose");

const rankSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    rollNo: { type: String, required: true },
    marks: { type: Number, required: true },
  },
  { timestamps: true } // ✅ adds createdAt & updatedAt automatically
);

module.exports = mongoose.model("Rank", rankSchema);
