const express = require("express");
const router = express.Router();
const axios = require("axios");
const googleKey = process.env.API_KEY;

router.get("/booksApiCall", (req, res, next) => {
  console.log(req.query);
  axios
    .get(
      `https://www.googleapis.com/books/v1/volumes?q=${req.query.bookSearch}&key=${googleKey}`
    )
    .then(response => {
<<<<<<< HEAD
      // res.json(response.data.items[0].volumeInfo.title);
      res.render("bookApiResults", {
        results: response.data.items,
        user: req.user
      });
=======
      res.render("bookApiResults", { results: response.data.items });
>>>>>>> f48efdb9253158d7fd872b29f50e19ebfb264a38
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
      res.render("bookDetails", response.data);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;