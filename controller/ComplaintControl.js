const compLaint = require("../models/complaintModele");
require("dotenv").config();

function ComplaintModule() {
  this.addComlaint = async (req, res) => {
    const { desc, date, appoId, empId, userId } = req.body;
    if (desc && date) {
      let compLaintkObj = {
        complaintDesc: desc,
        complaintDate: date,
        empId,
        appoId,
        userId,
        markAsRead: false,
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

  this.ViewEmpComplaint = async (req, res) => {
    const { empId } = req.body;
    if (empId) {
      const data = await compLaint
        .find({ empId, markAsRead: false })
        .populate("appoId");

      res.send({
        status: true,
        data,
      });
    } else {
      res.send({
        status: false,
        message: "provide data",
      });
    }
  };

  this.MarkReadEmp = async (req, res) => {
    const { id } = req.body;
    if (id) {
      const data = await compLaint.findByIdAndUpdate(
        id,
        { markAsRead: true },
        { new: true }
      );
      if (data) {
        res.send({
          status: true,
        });
      }
    } else {
      res.send({
        status: false,
        message: "provide data",
      });
    }
  };
}

module.exports = new ComplaintModule();
