const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userReviewSchema = new Schema({
  content: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const UserReview = mongoose.model("UserReview", userReviewSchema);

module.exports = UserReview;
