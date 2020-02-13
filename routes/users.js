const express = require("express");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");
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
          books: bookNames,
          loggedIn: req.user
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
    .populate("books unavailableBooks")
    .then(response => {
      let showDelete = false;
      if (req.user && userId.toString() === req.user._id.toString()) {
        showDelete = true;
      }
      let unavailableIds = response.unavailableBooks.map(book => book.googleId);
      res.render("userProfile", {
        result: response,
        unavailableIds: unavailableIds,
        showDelete: showDelete
      });
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

router.get("/profile/:userId/:bookId/allow", (req, res, next) => {
  User.findById(req.params.userId)
    .populate("books")
    .then(foundUser => {
      return User.updateOne(
        { _id: foundUser._id },
        { $push: { unavailableBooks: req.params.bookId } }
      );
    })
    .then(() => {
      res.redirect(`/profile/${req.params.userId}`);
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});

router.get("/profile/:userId/:bookId/return", (req, res, next) => {
  User.findById(req.params.userId)
    .populate("books")
    .then(foundUser => {
      return User.updateOne(
        { _id: foundUser._id },
        { $pull: { unavailableBooks: req.params.bookId } }
      );
    })
    .then(() => {
      res.redirect(`/profile/${req.params.userId}`);
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});

module.exports = router;
