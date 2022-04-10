const feedBack = require("../models/feedBackModule");

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

  this.viewFeedBack = async (req, res) => {
    try {
      const data = await feedBack
        .find({})
        .sort({ _id: -1 })
        .populate("appoId")
        .limit(5);

      if (data) {
        res.send({ status: true, data });
      } else {
        res.send({ status: false });
      }
    } catch (e) {
      res.send({ status: false });
    }
  };
}

module.exports = new FeedBackControl();
