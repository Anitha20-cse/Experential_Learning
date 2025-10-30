const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  deptYear: { type: String, required: true },
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  college: { type: String, required: true },
  category: { type: String, enum: ["academic", "non-academic"], required: true },
  prize: { 
    type: String, 
    enum: ["1st Prize", "2nd Prize", "3rd Prize", "Participation"], 
    required: true 
  },
  cashPrize: { type: Number, default: 0 }, // ₹ amount
  file: { type: String }, // uploaded image path
}, { timestamps: true });

module.exports = mongoose.model("Achievement", achievementSchema);
