const mongoose = require("mongoose");

let appointmentSchema = new mongoose.Schema({
    userid:String,
    username:String,
    useremail:String,
    userphone:String,
    userAddress:String,
    service:String,
    charge:String,
    area:String,
    emp_appoint:String,
    dateTime:String
})

module.exports = mongoose.model("Appointment",appointmentSchema)