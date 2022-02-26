const _ = require("underscore");
const bcrypt = require("bcrypt");
const user = require("../models/userModel");
const OTP = require("../models/otpModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
const config = require("../Config");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email,
    pass: config.password,
  },
});
function controller() {
  this.login = async (req, res) => {
    const { email, password } = req.body;
    if (_.isEmpty(email)) {
      res.send({ status: false, message: "Plz,Enter E-mail" });
    } else if (_.isEmpty(password)) {
      res.send({ status: false, message: "Plz,Enter Password" });
    } else {
      await user
        .find({ email: email }, (err, userdata) => {
          if (userdata.length <= 0)
            return res.json({ status: false, message: "please sign up" });
          bcrypt.compare(
            password,
            userdata[0].password,
            function (err, result) {
              if (result) {
                let Token = jwt.sign({ email: email }, config.SECRET_KEY, {
                  expiresIn: "10m",
                });
                return res.send({
                  status: true,
                  Data: userdata[0],
                  token: Token,
                });
              } else
                return res.json({
                  status: false,
                  message: "please enter correct password",
                });
            }
          );
        })
        .clone();
    }
  };

  this.signup = async (req, res) => {
    const { email, password } = req.body;
    if (_.isEmpty(email) || _.isEmpty(password)) {
      res.send({ status: false, message: "Plz,Enter Details.." });
    } else {
      const emailsearch = await user.exists({ email: email });
      if (emailsearch) {
        return res.json({
          status: false,
          message: "This Email already Registered",
        });
      }
      bcrypt.hash(password, 10, async function (err, hash) {
        let myDetail = new user({ password: hash, email });
        await myDetail
          .save()
          .then(() => {
            return res.json({
              status: true,
              message: "Thanks for signning up",
            });
          })
          .catch((err) => {
            return err;
          });
      });
    }
  };

  this.forgetPassword = async (req, res) => {
    const { email, new_pass } = req.body;
    await bcrypt.hash(new_pass, 10, async (err, hash) => {
      if (!err) {
        await user.updateOne({ email: email }, { password: hash });
        res.send({
          status: true,
          message: "Password Changed Successfully",
        });
      } else {
        throw err;
      }
    });
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

  this.changePassword = async (req, res) => {
    let { email, Otp, new_pass } = req.body;
    if (!email) {
      res.send({ status: false, message: "plz,enter email" });
    } else if (!Otp) {
      res.send({ status: false, message: "plz,enter OTP" });
    } else if (!new_pass) {
      res.send({ status: false, message: "plz,enter New Password" });
    } else {
      await OTP.findOne({ email: email, code: Otp }, (err, data) => {
        if (!err) {
          if (data) {
            let currTime = new Date().getTime();
            console.log(data.expiresIn - currTime);
            if (currTime < data.expiresIn) {
              bcrypt.hash(new_pass, 10, (err, hash) => {
                if (!err) {
                  user.updateOne({ email: email }, { password: hash });
                  res.send({
                    status: true,
                    message: "Password Changed Successfully",
                  });
                } else {
                  throw err;
                }
              });
            } else {
              res.send({ status: false, message: "OTP Expired.." });
            }
          } else {
            res.send({ status: false, message: "Invalid Otp.." });
          }
        } else {
          throw err;
        }
      });
    }
  };
}

module.exports = new controller();
