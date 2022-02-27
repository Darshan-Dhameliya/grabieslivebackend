const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const controller = require("./controller/userControl");
const controllerEmp = require("./controller/empControl");
const auth = require("./middleware/Auth");
const emailAuth = require("./middleware/EmailAuth");

const cors = require("cors");
const db_connect = require("./connection/connection");
const controllerAppointment = require("./controller/appointmentControl");

db_connect();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send({ message: "server workfine" }));

app.post("/signup", controller.signup);

app.post("/login", controller.login);

app.post(
  "/forgetpass",
  emailAuth.isRegistered,
  emailAuth.sendMail,
  emailAuth.VerifyOtp,
  controller.forgetPassword
);

app.post(
  "/emp/forgetpass",
  controllerEmp.isRegistered,
  emailAuth.sendMail,
  emailAuth.VerifyOtp,
  controllerEmp.forgetPassword
);

app.post("/emp/register", controllerEmp.register);

app.post("/emp/login", controllerEmp.login);

app.post("/changepass", controller.changePassword);

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

app.post("/emp/markdone", controllerAppointment.markAsCompleted);

app.post("/user/completeAppo", controllerAppointment.completdAppoUser);

app.post("/user/bookedAppo", controllerAppointment.BookedServiceUser);

app.post("/emp/completeAppo", controllerAppointment.completedAppoEmp);

app.post("/user/bookedAppo", controllerAppointment.BookedServiceEmp);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
