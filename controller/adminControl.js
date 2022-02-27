const res = require("express/lib/response");
const Appoint = require("../models/appointmentModel");
const Emp = require("../models/employeeModel");

function adminControl() {
  this.EmpList = async (req, res) => {
    const data = await Emp.find({});
    res.send({ data });
  };
}

module.exports = new adminControl();
