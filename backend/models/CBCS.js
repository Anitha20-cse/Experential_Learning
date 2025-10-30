const mongoose = require("mongoose");

const cbcsSchema = new mongoose.Schema(
  {
    sno: { type: Number },
    regno: { type: String, required: true },
    name: { type: String, required: true },
    s1: { type: String }, // Theory of Computation
    s2: { type: String }, // Artificial Intelligence
    s3: { type: String }, // Modern Web Technologies
    s4: { type: String }, // NoSQL
    s5: { type: String }, // WFP
    subjects: {
      s1: { type: String, default: 'Theory of Computation' },
      s2: { type: String, default: 'Object Oriented Analysis and Design' },
      s3: { type: String, default: 'DevOps and Agile Methodology' },
      s4: { type: String, default: 'Modern Web Technologies' },
      s5: { type: String, default: 'Artificial Intelligence' }
    },
    fileName: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CBCS", cbcsSchema);