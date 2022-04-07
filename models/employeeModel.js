const mongoose = require("mongoose");

let employeSchema = new mongoose.Schema({
  empName: String,
  email: String,
  phone: String,
  service_Area: String,
  service_Spec: String,
  password: String,
  isVerified: Boolean,
  memrship_plan: String,
});

module.exports = new mongoose.model("Employee", employeSchema);
