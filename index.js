const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const controller = require("./controller/userControl");
const controllerEmp = require("./controller/empControl");
const controllerAdmin = require("./controller/adminControl");
const auth = require("./middleware/Auth");
const emailAuth = require("./middleware/EmailAuth");
const adminControl = require("./controller/adminControl");
const cors = require("cors");
const db_connect = require("./connection/connection");
const controllerAppointment = require("./controller/appointmentControl");
const fedbackcontrol = require("./controller/FeedBackController");
const complaintcontrol = require("./controller/ComplaintControl");
const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });
const PaymentController = require("./Paytm/index");

db_connect();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send({ message: "server workfine" }));

//user
app.post("/user/signup", controller.signup);
app.post("/user/login", adminControl.loginAdmin, controller.login);
app.post(
  "/user/forgetpass",
  controller.isRegistered,
  emailAuth.sendMail,
  emailAuth.VerifyOtp,
  controller.changePassword
);
app.post(
  "/user/appointment",
  controllerAppointment.checkAppoExist,
  controllerAppointment.checkEmpFree,
  controllerAppointment.makeAppo
);
app.post(
  "/user/chekempavilability",
  controllerAppointment.checkAppoExist,
  controllerAppointment.checkEmpFree,
  controllerAppointment.DummyMIddlware
);
app.post(
  "/user/changepass",
  controller.ValidatePassword,
  controller.changePassword
);
app.post("/user/completeAppo", controllerAppointment.completdAppoUser);

//emp
app.post(
  "/emp/forgetpass",
  controllerEmp.isRegistered,
  emailAuth.sendMail,
  emailAuth.VerifyOtp,
  controllerEmp.changePassword
);
app.post("/emp/register", controllerEmp.register);
app.post("/emp/login", controllerEmp.login);
app.post(
  "/emp/changepass",
  controllerEmp.ValidatePassword,
  controllerEmp.changePassword
);
app.post("/user/bookedAppo", controllerAppointment.BookedServiceUser);
app.post("/emp/markdone", controllerAppointment.markAsCompleted);
app.post("/emp/completeAppo", controllerAppointment.completedAppoEmp);
app.post("/emp/bookedAppo", controllerAppointment.BookedServiceEmp);
app.post("/emp/markverified", controllerEmp.MarkIsVerfied);

//admin
app.get("/admin/totalcount", controllerAdmin.totalCount);
app.post("/admin/emplist", adminControl.EmpList);
app.post("/admin/Verifiedemplist", adminControl.Verifiedemplist);
app.post("/admin/unVerifiedemplist", adminControl.unVerifiedemplist);
app.post("/admin/bookAppo", adminControl.bookAppo);
app.post("/admin/completAppo", adminControl.completAppo);
app.post("/admin/unCompleteAppo", adminControl.unCompleteAppo);
app.post("/admin/userlist", adminControl.userList);
app.post("/admin/register", adminControl.addAdmin);
app.post(
  "/admin/changepass",
  controllerAdmin.ValidatePassword,
  controllerAdmin.changePassword
);
// app.post("/admin/userlist", adminControl.unVerifiedemplist);

//complaint
app.post("/complaint/make", complaintcontrol.addComlaint);
app.post("/feedback/make", fedbackcontrol.addFeedBack);

//paytm
app.post("/paynow", [parseUrl, parseJson], PaymentController.paymentPayNow);
app.post("/callback", PaymentController.paymentCallback);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
