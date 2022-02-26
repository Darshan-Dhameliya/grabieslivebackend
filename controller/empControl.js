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
          if (!userdata) return res.json("please sign up");
          bcrypt.compare(password, userdata.password, function (err, result) {
            if (result) {
              let Token = jwt.sign({ email: email }, config.SECRET_KEY, {
                expiresIn: "10m",
              });
              return res.send({ status: true, Data: userdata, token: Token });
            } else return res.json("please enter correct password");
          });
        } else throw err;
      }).clone();
    }
  };
}

module.exports = new empController();
