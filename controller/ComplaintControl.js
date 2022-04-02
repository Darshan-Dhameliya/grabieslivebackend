const compLaint = require("../models/complaintModele");
const _ = require("underscore");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const config = require("../Config");

function ComplaintModule() {
  this.addComlaint = async (req, res) => {
    const { desc, date, appoId, empId, userId } = req.body;
    console.log(req.body);
    if (desc && date) {
      let compLaintkObj = {
        complaintDesc: desc,
        complaintDate: date,
        empId,
        appoId,
        userId,
      };
      compLaint.create(compLaintkObj, (err, data) => {
        if (data) {
          res.send({
            status: true,
            message:
              "complaint register sucesfully,we solve it ASAP possible..",
          });
        } else {
          res.send({
            status: false,
            message: "something went wrong please try again",
          });
        }
      });
    } else {
      res.send({
        status: false,
        message: "provide data",
      });
    }
  };
}

module.exports = new ComplaintModule();
