const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Book = require("../models/Book");

router.get("/allUsers", (req, res, next) => {
  User.find()
    .populate("books")
    .then(foundUsers => {
      let result = [];
      foundUsers.forEach(user => {
        if (user.books.length == 0) {
          return;
        }
        let bookNames = user.books.reduce((acc, book, index) => {
          return (
            acc +
            `<li><a href="/bookDetails/${book.googleId}">` +
            book.title +
            `</a></li>`
          );
        }, "");
        result.push({
          userId: user._id,
          userName: user.username,
          address: user.address,
          books: bookNames
        });
      });
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});

router.get("/profile/:userId", (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .populate("books")
    .then(response => {
      //res.send(response);
      let showDelete = false;
      if (userId.toString() === req.user._id.toString()) {
        showDelete = true;
      }
      res.render("userProfile", { result: response, showDelete: showDelete });
    });
});

router.get("/bookDetails/:id/delete", (req, res, next) => {
  const query = { _id: req.params.id };
  Book.findOne(query)
    .then(foundBook => {
      return Book.updateOne(
        { _id: foundBook._id },
        { $pull: { owners: req.user._id } }
      ).then(() => {
        return User.updateOne(
          { _id: req.user._id },
          { $pull: { books: foundBook._id } }
        );
      });
    })
    .then(() => {
      res.redirect(`/profile/${req.user._id}`);
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});

module.exports = router;
