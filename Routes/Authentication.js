const _ = require("underscore");
const bcrypt = require("bcrypt");
const user = require("../models/UserModel");

function controller() {
  this.login = async (req, res) => {
    const { email, password } = req.body;
    if (_.isEmpty(email)) {
      res.send({ status: false, message: "Plz,Enter E-mail" });
    } else if (_.isEmpty(password)) {
      res.send({ status: false, message: "Plz,Enter Password" });
    } else {
      await user.find({ email: email }, (err, userdata) => {
        if (userdata.length <= 0) return res.json("please sign up");
        bcrypt.compare(password, userdata[0].password, function (err, result) {
          console.log(result);
          if (result) return res.send(userdata[0]);
          else return res.json("please enter correct password");
        });
      });
    }
  };

  this.signup = async (req, res) => {
    const { email, password } = req.body;
    if (_.isEmpty(email) || _.isEmpty(password)) {
      res.send({ status: false, message: "Plz,Enter Details.." });
    } else {
      const emailsearch = await user.exists({ email: email });
      if (emailsearch) {
        return res.json("This Email already Registered");
      }
      bcrypt.hash(password, 10, async function (err, hash) {
        let myDetail = new user({ password: hash, email });
        console.log(hash);
        await myDetail.save().then(() => {
          return res.json("Thanks for signning up");
        });
      });
    }
  };
}

module.exports = new controller();
