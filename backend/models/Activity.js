// models/Activity.js
const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true }, // Activity name
  date: { type: Date, required: true },    // When it happened
  description: { type: String },           // About the activity
  image: { type: String },                 // Path/URL for uploaded image
  teacherEmail: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Activity", activitySchema);
