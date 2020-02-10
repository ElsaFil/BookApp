const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/books", (req, res, next) => {
  console.log(req.query);
  axios
    .get(
      `https://www.googleapis.com/books/v1/volumes?q=${req.query.bookSearch}`
    )
    .then(response => {
      res.json(response.data);
    })
    .catch(err => {
      console.log(err);
    });
});
module.exports = router;
