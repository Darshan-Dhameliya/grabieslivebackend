const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  rating: String,
  feedbackDesc: String,
  feedbackDate: String,
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

module.exports = mongoose.model("feedback", UserSchema);
