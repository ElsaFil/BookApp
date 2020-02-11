const express = require("express");
const router = express.Router();
const axios = require("axios");
const googleKey = process.env.API_KEY;
const User = require("../models/User");
const Book = require("../models/Book");

router.get("/booksApiCall", (req, res, next) => {
  console.log(req.query);
  axios
    .get(
      `https://www.googleapis.com/books/v1/volumes?q=${req.query.bookSearch}&key=${googleKey}`
    )
    .then(response => {
      res.render("bookApiResults", {
        results: response.data.items,
        user: req.user
      });
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
      //return res.send(response.data);
      res.render("bookDetails", { result: response.data, user: req.user });
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
        coverImageUrl: response.data.volumeInfo.imageLinks.thumbnail,
        infoLinkURL: response.data.volumeInfo.infoLink,
        googleId: req.params.bookGoogleId,
        owners: req.user._id
      })
        .then(() => {
          res.redirect(`/bookDetails/${req.params.bookGoogleId}`);
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
