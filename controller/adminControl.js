const Emp = require("../models/employeeModel");
const Appo = require("../models/appointmentModel");
const User = require("../models/userModel");

function adminControl() {
  this.totalCount = async (req, res) => {
    const TotalUser = await User.count({});
    const ToatalEmp = await Emp.count({});
    const ToatalVerifiedEmp = await Emp.count({ isVerified: true });
    const ToatalAppoiment = await Appo.count({});
    const ToatalCompletedAppoiment = await Appo.count({ isCompleted: true });
    const ToatalUnCompletedAppoiment =
      ToatalAppoiment - ToatalCompletedAppoiment;
    const ToatalUnVerifiedEmp = ToatalEmp - ToatalVerifiedEmp;

    res.send({
      TotalUser,
      ToatalEmp,
      ToatalAppoiment,
      ToatalVerifiedEmp,
      ToatalCompletedAppoiment,
      ToatalUnCompletedAppoiment,
      ToatalUnVerifiedEmp,
    });
  };

  this.EmpList = async (req, res) => {
    const Empdata = await Emp.find({});
    res.send({ Empdata });
  };
  this.Verifiedemplist = async (req, res) => {
    const Empdata = await Emp.find({ isVerified: true });
    res.send({ Empdata });
  };
  this.unVerifiedemplist = async (req, res) => {
    const Empdata = await Emp.find({ isVerified: false });
    res.send({ Empdata });
  };
}

module.exports = new adminControl();
