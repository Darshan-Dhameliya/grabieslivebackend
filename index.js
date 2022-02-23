const express = require("express");
const app = express();
const PORT = 8000;
const controller = require("./controller/userControl");
const controllerEmp = require("./controller/empControl");
const auth = require("./middleware/Auth");
const cors = require("cors");
const db_connect = require("./connection/connection");

db_connect();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send({ message: "server workfine" }));

app.post("/signup", controller.signup);

app.post("/login", controller.login);

app.post(
  "/forgetpass",
  controller.isRegistered,
  controller.sendMail,
  controller.forgetPassword
);

app.post("/emp/register", controllerEmp.register);

app.post("/emp/login", controllerEmp.login);

app.post("/changepass", controller.changePassword);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
