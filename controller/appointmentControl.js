const _ = require("underscore");
const moment = require("moment");
const Appoint = require("../models/appointmentModel");
const Emp = require("../models/employeeModel");

function appointment(){

    this.makeAppo = (req,res)=>{
        let bdata = req.body;
        bdata.userid = req.Uid;
        bdata.useremail = req.email;
        bdata.dateTime = moment().format('lll');
        Appoint.find({userid:bdata.userid},(err,Uappoints)=>{
            if(err) throw err;
            if(Uappoints){
                Uappoints.map((item)=>{
                    if(bdata.service==item.service){
                        res.send(`Appointment Already Taken For This on ${item.dateTime}`)
                    }else{
                        Emp.findOne({service_Spec:bdata.service,service_Area:bdata.area},(err,data)=>{
                            if(err) throw err;
                            if(data){
                                bdata.emp_appoint = data._id;
                                Appoint.create(bdata,(err,resu)=>{
                                    if(!err){
                                        res.send({AppID:resu._id,message:"appointment taken successfully.."})
                                    }else throw err;
                                });
                            }else return res.send("currently this area is not servicable by us..")
                        });
                    }
                })
            }
        })
    }

    this.updAppo = (req,res)=>{
        
    }
}

module.exports = new appointment();