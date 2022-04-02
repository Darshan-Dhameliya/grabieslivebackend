const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  complaintDesc: String,
  complaintDate: String,
  empId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  appoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userinfo",
  },
});

module.exports = mongoose.model("Complaint", ComplaintSchema);
