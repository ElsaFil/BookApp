const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Book = require("../models/Book");

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
        let ownerEmail = owner.email;
        let comment = req.body.message;

        transporter
          .sendMail({
            from: `"Books Borrow App" "booksborrowapp@gmail.com"`,
            to: ownerEmail,
            subject: `New private message`,
            text: `Someone wants to borrow one of your books.`,
            html: `<b>Good news!</b> <br> The user <strong>${req.user.username}</strong> 
          wants to borrow your book with the title <i>${foundBook.title}</i>.
          <br>
          Message from user:
          <p><i>${comment}</i></p>
          <br>
          Click on the following link to allow: 
          <a href="${process.env.BASEURL}profile/${req.params.userId}/${foundBook._id}/allow">Allow Request</a>`
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
