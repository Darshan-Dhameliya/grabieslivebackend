const Emp = require("../models/employeeModel");
const _ = require("underscore");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const config = require("../Config");

function empController() {
  this.register = async (req, res) => {
    const { name, email, phone, area, spec, password } = req.body;
    if (name && email && phone && area && spec && password) {
      {
        const emailsearch = await Emp.exists({ email: email });
        if (emailsearch) {
          return res.json({
            status: false,
            message: "This Email already Registered",
          });
        }
        bcrypt.hash(password, 10, async function (err, hash) {
          if (!err) {
            let empObj = {
              empName: name,
              email: email,
              phone: phone,
              service_Area: area,
              service_Spec: spec,
              password: hash,
              isVerified: false,
            };
            Emp.create(empObj, (err, data) => {
              if (!err) {
                res.send({ status: true, message: "Thanks For Signing Up.." });
              } else throw err;
            });
          } else throw err;
        });
      }
    }
  };

  this.login = async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
      await Emp.findOne({ email: email }, (err, userdata) => {
        if (!err) {
          if (userdata) {
            if (userdata.isVerified) {
              bcrypt.compare(
                password,
                userdata.password,
                function (err, result) {
                  if (result) {
                    let Token = jwt.sign({ email: email }, config.SECRET_KEY, {
                      expiresIn: "10m",
                    });
                    return res.send({
                      status: true,
                      Data: userdata,
                      token: Token,
                    });
                  } else
                    return res.json({
                      status: false,
                      message: "please enter correct password",
                    });
                }
              );
            } else {
              return res.json({
                status: false,
                message:
                  "Your Account is Not Verified,For More Details Please Contact Administor",
              });
            }
          } else {
            return res.json({
              status: false,
              message: "please sign up",
            });
          }
        } else throw err;
      }).clone();
    }
  };

  this.forgetPassword = async (req, res) => {
    const { email, new_pass } = req.body;
    await bcrypt.hash(new_pass, 10, async (err, hash) => {
      if (!err) {
        await Emp.updateOne({ email: email }, { password: hash });
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
    await Emp.findOne({ email: email }, async (err, data) => {
      if (data) {
        next();
      } else {
        res.send({ status: false, message: "Your account Not found" });
      }
    }).clone();
  };
}

module.exports = new empController();
