const express = require("express");
const router = express.Router();
const axios = require("axios");
const Book = require("../models/Book");
const googleKey = process.env.API_KEY;
const User = require("../models/User");
let startIndex = 0;

router.get("/booksApiCall", (req, res, next) => {
  axios
    .get(
      `https://www.googleapis.com/books/v1/volumes?q=${req.query.bookSearch}|inauthor:${req.query.bookSearch}&maxResults=39&startIndex=${startIndex}&printType=books&key=${googleKey}`
    )
    .then(response => {
      res.render("bookApiResults", { results: response.data.items });
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/bookDetails/:bookGoogleId", (req, res, next) => {
  axios
    .get(
      `https://www.googleapis.com/books/v1/volumes/${req.params.bookGoogleId}?key=${googleKey}`
    )
    .then(response => {
      Book.findOne({ googleId: response.data.id })
        .populate("owners")
        .then(foundBook => {
          if (foundBook) {
            res.render("bookDetails", {
              result: response.data,
              owners: foundBook.owners
            });
          } else {
            res.render("bookDetails", { result: response.data });
          }
        });
    })
    .catch(err => {
      console.log(err);
    });
});

router.post("/bookDetails/:bookGoogleId", (req, res, next) => {
  axios
    .get(
      `https://www.googleapis.com/books/v1/volumes/${req.params.bookGoogleId}?key=${googleKey}`
    )
    .then(response => {
      Book.findOne({ googleId: response.data.id }).then(foundBook => {
        if (!foundBook) {
          Book.create({
            title: response.data.volumeInfo.title,
            subtitle: response.data.volumeInfo.subtitle,
            authors: response.data.volumeInfo.authors,
            description: response.data.volumeInfo.description,
            ISBN_10: response.data.volumeInfo.industryIdentifiers[0].identifier,
            ISBN_13: response.data.volumeInfo.industryIdentifiers[1].identifier,
            pageCount: response.data.volumeInfo.pageCount,
            categories: response.data.volumeInfo.categories,
            averageRating: response.data.volumeInfo.averageRating,
            language: response.data.volumeInfo.language,
            coverImageURL: response.data.volumeInfo.imageLinks.thumbnail,
            infoLinkURL: response.data.volumeInfo.infoLink,
            googleId: req.params.bookGoogleId,
            owners: req.user._id,
            available: true
          })
            .then(createdBook => {
              return User.updateOne(
                { _id: req.user._id },
                { $push: { books: createdBook._id } }
              );
            })
            .then(() => res.redirect(`/bookDetails/${req.params.bookGoogleId}`))
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("in db");
          User.findById(req.user._id)
            .then(foundUser => {
              if (foundUser.books.includes(foundBook._id)) {
              } else {
                return User.updateOne(
                  { _id: req.user._id },
                  { $push: { books: foundBook._id } }
                ).then(() => {
                  return Book.updateOne(
                    { _id: foundBook._id },
                    { $push: { owners: foundUser._id } }
                  );
                });
              }
            })
            .then(() => res.redirect(`/bookDetails/${req.params.bookGoogleId}`))
            .catch(err => {
              console.log(err);
            });
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/bookDetails/:bookGoogleId/owners", (req, res, next) => {
  let bookGoogleId = req.params.bookGoogleId;
  Book.findOne({ googleId: bookGoogleId })
    .populate("owners")
    .then(foundBook => {
      if (!foundBook) {
        return next(err);
      }
      response.json = book.owners;
    });
});

module.exports = router;
