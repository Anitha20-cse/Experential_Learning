const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema({
  regno: { type: String, required: true },
  provider: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  year: { type: String, required: true },
  status: { type: String, required: true },
  appliedDate: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
});

module.exports = mongoose.model("Scholarship", scholarshipSchema);