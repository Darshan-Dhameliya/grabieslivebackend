const express = require("express");
const app = express();
const PORT = 8000;
const controller = require("./Routes/controller");
const auth = require("./middleware/Auth");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => res.send({ message: "server workfine" }));

app.post("/signup", controller.signup);

app.post("/login", controller.login);

app.post("/forgetpass", controller.forgetPassword);

app.post("/changepass", controller.changePassword);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
