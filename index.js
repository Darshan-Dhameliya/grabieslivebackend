const express = require("express");
const app = express();
const PORT = 4000;
const Authentication = require("./Routes/Authentication");

app.use(express.json());

app.post("/signup", Authentication.signup);

app.post("/login", Authentication.login);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
