const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  email: String,
  password: String,
  feedbackDesc: String,
  feedbackDate: String,
  ServiceDate: String,
});

module.exports = mongoose.model("Complaint", ComplaintSchema);
