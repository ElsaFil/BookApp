const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  displayName: String,
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, "is invalid"],
    index: true
  },
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
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "UserReview"
    }
  ]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
