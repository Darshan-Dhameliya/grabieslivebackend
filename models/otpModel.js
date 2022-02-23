const mongoose = require("mongoose");



const otpSchema = new mongoose.Schema({
    email: String,
    code: Number,
    expiresIn : Number
});

module.exports = mongoose.model("otp", otpSchema);