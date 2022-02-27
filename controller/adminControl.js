const Emp = require("../models/employeeModel");
const Appo = require("../models/appointmentModel");
const User = require("../models/userModel");

function adminControl() {
    this.totalEmp = (req, res) => {
        var varified = 0;
        var unverified = 0;
        Emp.find({}, (err, total) => {
            if (err) throw err;
            if (total) {
                total.map((item) => {
                    if (item.isVerified == true) {
                        varified++;
                    } else {
                        unverified++;
                    }
                });
                res.send({ Verified: varified, unVerified: unverified, Total: total.length })
            }
        })
    }

    this.totalAppo = (req, res) => {
        var completed = 0;
        var uncompleted = 0;
        Appo.find({}, (err, totAppo) => {
            if (err) throw err;
            if (totAppo) {
                totAppo.map((item) => {
                    if (item.isCompleted) {
                        completed++;
                    } else {
                        uncompleted++;
                    }
                });
                res.send({ Completed: completed, unCompleted: uncompleted, Total: totAppo.length })
            }
        })
    }

    this.totalUser = (req, res) => {
        User.count({}, (err, total) => {
            if (err) throw err;
            if (total) {
                res.send({ TotalUser: total })
            }
        })
    }
}

module.exports = new adminControl();