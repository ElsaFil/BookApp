const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String
  },
  subtitle: {
    type: String
  },
  authors: {
    type: Array,
    required: true
  },
  description: String,
  ISBN_10: {
    type: String,
    required: true
  },
  ISBN_13: {
    type: String,
    required: true
  },
  pageCount: Number,
  categories: Array,
  averageRating: Number,
  language: String,
  coverImageURL: String,
  infoLinkURL: String,
  googleId: {
    type: String
  },
  owners: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
