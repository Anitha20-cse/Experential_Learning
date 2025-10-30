const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema(
  {
    parentEmail: {
      type: String,
      required: true,
    },
    studentRollNo: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    leaveType: {
      type: String,
      required: true,
      enum: ["Sick Leave", "Vacation", "Personal", "Other"],
    },
    reason: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    teacherComments: {
      type: String,
      default: "",
    },
    teacherEmail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);
