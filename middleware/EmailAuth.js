const _ = require("underscore");
const bcrypt = require("bcrypt");
const user = require("../models/userModel");
const OTP = require("../models/otpModel");
const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.email,
    pass: process.env.password,
  },
});
function controller() {
  this.sendMail = async (req, res, next) => {
    const { email } = req.body;
    if (email) {
      await OTP.findOne({ email: email }, async (err, otpdata) => {
        if (otpdata) {
          req.OTPvalue = otpdata;
          next();
        } else {
          const otpcode = Math.floor(1000 + Math.random() * 9000);
          const time = new Date().getTime() + 180 * 1000;
          var mailOptions = {
            from: process.env.email,
            to: email,
            subject: "OTP",
            text: `You Need An OTP For Login.OTP Expires In 3 Minutes.Your OTP Is ${otpcode}.`,
          };
          transporter.sendMail(mailOptions, async (err, info) => {
            let otpdata = {
              email: email,
              code: otpcode,
              expiresIn: time,
            };
            if (info) {
              await OTP.create(otpdata, (err, resu) => {
                res.send({
                  status: true,
                  message: "E-mail Sent Successfully",
                });
              });
            } else {
              res.send({
                status: false,
                message: "Something Went Wrong Please try Again",
              });
            }
          });
        }
      }).clone();
    } else {
      res.send("something went wrong");
    }
  };

  this.VerifyOtp = async (req, res, next) => {
    const { c_otp } = req.body;
    const data = req.OTPvalue;

    if (data.code === parseInt(c_otp)) {
      let currTime = new Date().getTime();
      if (currTime < data.expiresIn) {
        //delete otp after verification
        await OTP.deleteOne({ id: data.id }, function (err, docs) {
          if (err) {
            console.log(errr);
          }
        }).clone();
        next();
      } else {
        //delete otp after otp expire
        await OTP.deleteOne({ id: data.id }, function (err, docs) {
          if (err) {
            console.log(err);
          }
        }).clone();
        res.send({ status: false, message: "OTP Expired.." });
      }
    } else {
      res.send({ status: false, message: "Invalid Otp.." });
    }
  };

  this.DeleteOtp = async (req, res) => {
    const data = req.OTPvalue;
    await OTP.deleteOne({ id: data.id }, function (err, docs) {
      if (err) {
      } else {
        res.send({});
      }
    }).clone();
  };

  this.isRegistered = async (req, res, next) => {
    const { email } = req.body;
    await user
      .findOne({ email: email }, async (err, data) => {
        if (data) {
          next();
        } else {
          res.send({ status: false, message: "Your account Not found" });
        }
      })
      .clone();
  };
}

module.exports = new controller();
