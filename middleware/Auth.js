const jwt = require("jsonwebtoken");
const _ = require("underscore");
const config = require("../Config");

require("dotenv").config();

module.exports = (req, res, next) => {
  if (!_.isEmpty(req.headers.authorization)) {
    let token = req.headers.authorization;
    let decoded = jwt.verify(token, config.SECRET_KEY);
    if (decoded) {
      req.email = decoded.email;
      next();
    } else {
      throw "Something Went Wrong.";
    }
  } else {
    res.send({ status: false, message: "plz,provide token" });
  }
};
