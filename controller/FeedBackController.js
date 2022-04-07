const feedBack = require("../models/feedBackModule");
const _ = require("underscore");
require("dotenv").config();
function FeedBackControl() {
  this.addFeedBack = async (req, res) => {
    const { rating, desc, date, appoId, empId, userId } = req.body;
    if (rating && desc && date && appoId) {
      let feedbackObj = {
        rating: rating,
        feedbackDesc: desc,
        feedbackDate: date,
        empId,
        appoId,
        userId,
      };
      feedBack.create(feedbackObj, (err, data) => {
        if (data) {
          res.send({
            status: true,
            message: "Thanks for giving review..",
          });
        } else {
          res.send({
            status: false,
            message: "something went wrong please try again",
          });
        }
      });
    } else {
      res.send({
        status: false,
        message: "provide data",
      });
    }
  };
}

module.exports = new FeedBackControl();
