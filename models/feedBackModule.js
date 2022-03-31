const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  feedbackDesc: String,
  feedbackDate: String,
  ServiceDate: String,
});

module.exports = mongoose.model("feedback", UserSchema);
