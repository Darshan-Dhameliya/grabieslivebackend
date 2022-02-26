const express = require("express");
const app = express();
const PORT = 8000;
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

app.post("/emp/register", controllerEmp.register);

app.post("/emp/login", controllerEmp.login);

app.post("/changepass", controller.changePassword);

app.post(
  "/user/appointment",
  controllerAppointment.checkAppoExist,
  controllerAppointment.checkEmpFree,
  controllerAppointment.makeAppo
);

app.post("/emp/markdone", controllerAppointment.markAsCompleted);

app.post("/user/completeAppo", controllerAppointment.completemakeAppoUser);

app.post(
  "/user/chekempavilability",
  controllerAppointment.checkAppoExist,
  controllerAppointment.checkEmpFree,
  controllerAppointment.DummyMIddlware
);

app.post("/user/completeAppo", controllerAppointment.completemakeAppoEmp);

app.post("/emp/markdone", controllerAppointment.markAsCompleted);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
