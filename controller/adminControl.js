const Emp = require("../models/employeeModel");
const Appo = require("../models/appointmentModel");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../Config");
const compLaint = require("../models/complaintModele");
const feedBack = require("../models/feedBackModule");

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
    const TotalComplaint = await compLaint.count({});
    const TotalfeedBack = await feedBack.count({});

    res.send({
      TotalUser,
      ToatalEmp,
      ToatalAppoiment,
      ToatalVerifiedEmp,
      ToatalCompletedAppoiment,
      ToatalUnCompletedAppoiment,
      ToatalUnVerifiedEmp,
      TotalComplaint,
      TotalfeedBack,
    });
  };

  this.EmpList = async (req, res) => {
    const data = await Emp.find({});
    res.send({ data });
  };

  this.Verifiedemplist = async (req, res) => {
    const data = await Emp.find({ isVerified: true });
    res.send({ data });
  };

  this.unVerifiedemplist = async (req, res) => {
    const data = await Emp.find({ isVerified: false });
    res.send({ data });
  };

  this.bookAppo = async (req, res) => {
    const data = await Appo.find({});
    res.send({ data });
  };

  this.completAppo = async (req, res) => {
    const data = await Appo.find({ isCompleted: true });
    res.send({ data });
  };

  this.unCompleteAppo = async (req, res) => {
    const data = await Appo.find({ isCompleted: false });
    res.send({ data });
  };

  this.userList = async (req, res) => {
    const data = await User.find({});
    res.send({ data });
  };

  this.loginAdmin = async (req, res, next) => {
    const { email, password } = req.body;
    if (email && password) {
      await Admin.find({ email: email }, (err, userdata) => {
        if (userdata.length <= 0) return next();
        bcrypt.compare(password, userdata[0].password, function (err, result) {
          if (result) {
            let Token = jwt.sign({ email: email }, config.SECRET_KEY, {
              expiresIn: "10m",
            });
            return res.send({
              status: true,
              Data: userdata[0],
              token: Token,
              userType: true,
            });
          } else
            return res.json({
              status: false,
              message: "please enter correct password",
            });
        });
      }).clone();
    } else {
      res.send({ status: false, message: "Plz,Enter data" });
    }
  };

  this.changePassword = async (req, res) => {
    const { id, new_pass } = req.body;
    await bcrypt.hash(new_pass, 10, async (err, hash) => {
      if (!err) {
        await Admin.updateOne({ _id: id }, { password: hash });
        res.send({
          status: true,
          message: "Password Changed Successfully",
        });
      } else {
        throw err;
      }
    });
  };

  this.addAdmin = async (req, res) => {
    const { email, password, name, number } = req.body;
    if (email && password && name && number) {
      const emailsearch = await Admin.exists({ email: email });
      if (emailsearch) {
        return res.json({
          status: false,
          message: "This admin already Registered",
        });
      }
      bcrypt.hash(password, 10, async function (err, hash) {
        let myDetail = new Admin({ password: hash, email, name, number });
        await myDetail
          .save()
          .then(() => {
            return res.json({
              status: true,
              message: "Admin add sucessfully",
            });
          })
          .catch((err) => {
            return err;
          });
      });
    } else {
      res.send({ status: false, message: "Plz,Enter Details.." });
    }
  };

  this.ValidatePassword = async (req, res, next) => {
    let { id, old_pass } = req.body;
    const data = await Admin.findById(id);
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

  this.viewFeedBack = async (req, res) => {
    try {
      const data = await feedBack.find({});
      if (data) {
        res.send({ status: true, data });
      } else {
        res.send({ status: false });
      }
    } catch (e) {
      res.send({ status: false });
    }
  };

  this.ViewComplaint = async (req, res) => {
    try {
      const data = await compLaint.find({});
      if (data) {
        res.send({ status: true, data });
      } else {
        res.send({ status: false });
      }
    } catch (e) {
      res.send({ status: false });
    }
  };
}

module.exports = new adminControl();
