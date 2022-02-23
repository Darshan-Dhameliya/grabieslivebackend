const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/CollegeBackend", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const otpSchema = new mongoose.Schema({
  email: String,
  code: Number,
  expiresIn: Date,
});

module.exports = mongoose.model("otp", otpSchema);
