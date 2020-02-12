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
  Book.deleteOne(query)
    .then(() => {
      res.redirect(`/profile/${req.user._id}`);
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});

router.get("/contact/:userId/:bookId", (req, res, next) => {
  res.render("contact", {
    userId: req.params.userId,
    bookId: req.params.bookId
  });
});

router.post("/contact/:userId/:bookId", (req, res, next) => {
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASSWORD
    }
  });

  Book.findOne({ googleId: req.params.bookId })
    .populate("owners")
    .then(foundBook => {
      if (foundBook) {
        let owner = foundBook.owners.filter(
          owner => owner._id.toString() === req.params.userId.toString()
        )[0];
        console.log("userEmail: " + owner.email);
        if (!owner) {
          res.redirect(`/bookDetails/${req.params.bookId}`);
          return;
        }
        let ownerName = owner.username;
        let ownerEmail = owner.email;
        let comment = req.body.message;

        transporter
          .sendMail({
            from: `"Books Borrow App" "booksborrowapp@gmail.com"`,
            to: ownerEmail,
            subject: `New private message`,
            text: `Someone wants to borrow one of your books.`,
            html: `<b>Good news!</b> <br> The user <strong>${ownerName}</strong> 
          wants to borrow your book with the title <i>${foundBook.title}</i>.
          <br>
          Message from user:
          <p><i>${comment}</i></p>
          <br>
          Click on the following link to allow: 
          <a href="${process.env.BASEURL}">Allow Request</a>`
          })
          .then(info => {
            res.redirect(`/bookDetails/${req.params.bookId}`);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        res.redirect(`/bookDetails/${req.params.bookId}`);
      }
    });
});

module.exports = router;
