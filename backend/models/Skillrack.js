// models/Skillrack.js
const mongoose = require("mongoose");

const skillrackSchema = new mongoose.Schema(
  {
    regNo: { type: String },
    name: { type: String },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }, // Reference to teacher who uploaded
  },
  { strict: false, timestamps: true }
);
module.exports = mongoose.model("Skillrack", skillrackSchema);
