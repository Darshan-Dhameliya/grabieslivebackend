const mongoose = require("mongoose");

module.exports = async function connect() {
  await mongoose
    .connect(
      "mongodb+srv://GrabiesLive:GrabiesLive@grabieslive.unhfo.mongodb.net/GrabiesLive?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then((response) => {
      console.log("DB Connected Successfully...");
    })
    .catch((err) => {
      throw err;
    });
};
