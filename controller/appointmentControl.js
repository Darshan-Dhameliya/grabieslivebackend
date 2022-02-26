const Appoint = require("../models/appointmentModel");
const Emp = require("../models/employeeModel");

function appointment() {
  this.makeAppo = async (req, res) => {
    let bdata = req.body;
    bdata.EmpID = req.EmpID;

    const ApppoiMentObJ = {
      emp_appoint: bdata.EmpID,
      userid: bdata.userid,
      username: bdata.username,
      useremail: bdata.useremail,
      userphone: bdata.userphone,
      userAddress: bdata.userAddress,
      service: bdata.service,
      charge: bdata.charge,
      area: bdata.area,
      date: bdata.date,
      time: bdata.time,
    };
    await Appoint.create(ApppoiMentObJ, (err, resu) => {
      if (resu) {
        res.send({
          status: true,
          AppID: resu._id,
          message: "appointment taken successfully..",
        });
      }
    });
  };

  this.markAsCompleted = async (req, res) => {
    const { id } = req.body;
    try {
      const data = await Appoint.findByIdAndUpdate(
        id,
        { isCompleted: true },
        { new: true }
      );
      res.send({ status: true, data });
    } catch (e) {
      res.send({ status: false, e });
    }
  };

  this.checkAppoExist = async (req, res, next) => {
    let bdata = req.body;
    const appoints = await Appoint.find({
      $and: [
        {
          userid: bdata.userid,
        },
        { service: bdata.service },
        { date: bdata.date },
        { time: bdata.time },
      ],
    }).clone();
    if (appoints.length) {
      res.send({
        status: false,
        message: "Appoiment Already Book For this",
      });
    } else {
      next();
    }
  };

  this.checkEmpFree = async (req, res, next) => {
    let bdata = req.body;

    const Empdata = await Emp.find({
      service_Spec: bdata.service,
      service_Area: bdata.area,
    })
      .select("id")
      .clone();
    const Empdataarr = [];
    Empdata.map((item) => Empdataarr.push(item.id));

    const empNotAvailable = await Appoint.find({
      emp_appoint: { $in: Empdataarr },
      time: bdata.time,
      date: bdata.date,
    })
      .select("emp_appoint")
      .clone();

    const empNotAvailablearr = [];
    empNotAvailable.map((item) => empNotAvailablearr.push(item.emp_appoint));

    const AvilableEmparr = Empdataarr.filter(function (obj) {
      return empNotAvailablearr.indexOf(obj) === -1;
    });

    if (AvilableEmparr.length) {
      req.EmpID = AvilableEmparr[0];
      next();
    } else {
      res.send({
        status: false,
        message: `Not Employee Avilable In ${bdata.area} on ${bdata.date} ${bdata.time},Please Choose Diffrent Time`,
      });
    }
  };

  this.DummyMIddlware = (req, res) => {
    res.send({ status: true });
  };

  this.completemakeAppoUser = async (req, res) => {
    const { id } = req.body;

    const data = await Appoint.find({
      $and: [{ emp_appoint: id }, { isCompleted: true }],
    });

    res.send({ status: true, data });
  };

  this.completemakeAppoEmp = async (req, res) => {
    const { id } = req.body;

    const data = await Appoint.find({
      $and: [{ userid: id }, { isCompleted: true }],
    });

    res.send({ status: true, data });
  };
}

module.exports = new appointment();
