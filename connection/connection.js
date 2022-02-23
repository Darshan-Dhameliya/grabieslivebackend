const mongoose = require("mongoose");

module.exports = function connect(){
    mongoose.connect("mongodb://localhost/CollegeBackend", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((response)=>{
    console.log("DB Connected Successfully...");
}).catch((err)=>{
    throw err;
})
}