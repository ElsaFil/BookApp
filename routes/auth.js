const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Enter username and password" });
    return;
  }
  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "This username already exists" });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username: username,
      password: hashPass
    });

    newUser
      .save()
      .then(newUser => {
        req.login(newUser, err => {
          if (err) return next(err);
          res.redirect("/");
        });
      })
      .catch(err => {
        console.log(err);
        //res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

module.exports = router;
