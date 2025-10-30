const mongoose = require("mongoose");

const circularSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
 
  category: {
    type: String,
    enum: ["Leave", "Celebration", "Competition", "Others"],
    required: true,
  },
  file: { type: String }, // PDF path
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Circular", circularSchema);
