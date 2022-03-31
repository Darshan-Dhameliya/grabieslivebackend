const _ = require("underscore");
const bcrypt = require("bcrypt");
const user = require("../models/userModel");
const OTP = require("../models/otpModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
const config = require("../Config");

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

  this.changePassword = async (req, res) => {
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

  this.ValidatePassword = async (req, res, next) => {
    let { id, old_pass } = req.body;
    const data = await user.findById(id);
    const matchData = await bcrypt.compare(old_pass, data.password);
    if (matchData) {
      next();
    } else {
      res.send({
        status: false,
        message: "old Password Not match",
      });
    }
  };
}

module.exports = new controller();
