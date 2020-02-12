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
          return acc + `<li>` + book.title + `</li>`;
        }, "");
        result.push({
          user: user.username,
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

module.exports = router;
