const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/CollegeBackend", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  email: String,
  password: String
});

module.exports = mongoose.model("userinfo", UserSchema);
