const mongoose = require("mongoose");

let employeSchema = new mongoose.Schema({
  empName: String,
  email: String,
  phone: String,
  service_Area: String,
  service_Spec: String,
  password: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
});

module.exports = new mongoose.model("Employee", employeSchema);
