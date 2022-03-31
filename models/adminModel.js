const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
  number: String,
  name: String,
});

module.exports = mongoose.model("admin", adminSchema);
