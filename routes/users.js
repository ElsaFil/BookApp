const express = require("express");
const router = express.Router();
const User = require("../models/User");

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
  let userId = req.params.userId;
  User.findById(userId)
    .populate("books")
    .then(response => {
      //res.send(response);
      res.render("userProfile", response);
    });
});

module.exports = router;
