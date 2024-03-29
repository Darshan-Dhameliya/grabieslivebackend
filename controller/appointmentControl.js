const Appoint = require("../models/appointmentModel");
const Emp = require("../models/employeeModel");

function appointment() {
  this.makeAppo = async (req, res) => {
    let bdata = req.body;
    bdata.EmpID = req.EmpID;
    const otpcode = Math.floor(100000 + Math.random() * 900000);

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
      dateAndTime: bdata.dateAndTime,
      sub_spec: bdata.sub_spec,
      isCompleted: false,
      otp: otpcode,
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
    const { id, c_otp } = req.body;

    try {
      const data = await Appoint.findById(id);
      if (c_otp === data.otp) {
        const data = await Appoint.findByIdAndUpdate(
          id,
          { isCompleted: true },
          { new: true }
        );
        if (data.isCompleted) {
          res.send({ status: true, message: "otp verify successfully" });
        } else {
          res.send({ status: false, message: "Something went wrong" });
        }
      } else {
        res.send({ status: false, message: "Please enter valid otp" });
      }
    } catch (e) {
      console.log(e);
      res.send({ status: false, message: "Something went wrong" });
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
        { isCompleted: false },
      ],
    }).clone();
    if (appoints.length) {
      res.send({
        status: false,
        message: "Appoiment Already Booked For this",
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
      isVerified: true,
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
    empNotAvailable.map((item) =>
      empNotAvailablearr.push(item.emp_appoint.toString())
    );

    const AvilableEmparr = Empdataarr.filter(function (obj) {
      return empNotAvailablearr.indexOf(obj) === -1;
    });

    if (AvilableEmparr.length) {
      req.EmpID =
        AvilableEmparr[Math.floor(Math.random() * AvilableEmparr.length)];
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

  this.BookedServiceEmp = async (req, res) => {
    const { id } = req.body;

    const data = await Appoint.find({
      emp_appoint: id,
      isCompleted: false,
    });

    res.send({ status: true, data });
  };

  this.BookedServiceUser = async (req, res) => {
    const { id } = req.body;

    const data = await Appoint.find({
      userid: id,
      isCompleted: false,
    });

    res.send({ status: true, data });
  };

  this.completdAppoUser = async (req, res) => {
    const { id } = req.body;

    const data = await Appoint.find({
      userid: id,
      isCompleted: true,
    });

    res.send({ status: true, data });
  };

  this.completedAppoEmp = async (req, res) => {
    const { id } = req.body;
    const data = await Appoint.find({ emp_appoint: id, isCompleted: true });

    res.send({ status: true, data });
  };

  this.DeleteCancelAppo = async (req, res) => {
    const { id } = req.body;

    try {
      const data = await Appoint.findByIdAndDelete(id);
      if (data) {
        res.send({ status: true, message: "Appoiment cancel successful" });
      } else {
        res.send({ status: false, message: "Something went wrong" });
      }
    } catch (e) {
      console.log(e);
      res.send({ status: false, message: "Something went wrong" });
    }
  };
}

module.exports = new appointment();
