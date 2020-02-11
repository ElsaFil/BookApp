const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  address: {
    street: String,
    number: String,
    PLZ: Number
  },
  role: {
    type: String,
    enum: ["basic", "admin"],
    default: "basic"
  },
  books: [
    {
      type: Schema.Types.ObjectId,
      ref: "Book"
    }
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "UserReview"
    }
  ]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
