const mongoose = require("mongoose");

let appointmentSchema = new mongoose.Schema({
  userid: String,
  username: String,
  useremail: String,
  userphone: String,
  userAddress: String,
  service: String,
  charge: String,
  area: String,
  sub_spec: String,
  emp_appoint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  date: String,
  time: String,
  dateAndTime: String,
  isCompleted: Boolean,
  otp: String,
});

module.exports = mongoose.model("Appointment", appointmentSchema);
