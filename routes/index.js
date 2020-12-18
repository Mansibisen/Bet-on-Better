const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");

//User model
const Donor = require("../models/Donor");
const Charity = require("../models/Charity");

router.get("/login", function (req, res) {
  res.render("login");
});

router.get("/register", function (req, res) {
  res.render("register");
});

//Register handle
router.post("/register", function (req, res) {
  const { name, email, password, password2, address, contact, role } = req.body;
  let errors = [];

  //Check required fields
  if (
    !name ||
    !email ||
    !password ||
    !password2 ||
    !address ||
    !contact ||
    !role
  ) {
    errors.push({ msg: "Please fill in all the fields" });
  }

  //Check password length
  else if (password.length < 6) {
    errors.push({ msg: "Password should atleast be 6 characters long" });
  }

  //Check if passwords match
  else if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
      address,
      contact,
      role,
    });
  } else {
    //Validation passed
    if (role === "donor") {
      //Donor db
      Donor.findOne({ email: email }).then(function (user) {
        if (user) {
          //User exists
          errors.push({ msg: "Email is already registered" });
          res.render("register", {
            errors,
            name,
            email,
            password,
            password2,
            address,
            contact,
            role,
          });
        } else {
          const newUser = new Donor({
            name,
            email,
            password,
            address,
            contact,
            role,
          });

          //Hash password
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
              if (err) throw err;

              //Set password to hashed
              newUser.password = hash;

              newUser
                .save()
                .then(function (user) {
                  req.flash(
                    "success_msg",
                    "Signup is successful and you can login!"
                  );
                  res.redirect("/login");
                })
                .catch(function (err) {
                  console.log(err);
                });
            });
          });
        }
      });
    } else {
      //Charity db
      Charity.findOne({ email: email }).then(function (user) {
        if (user) {
          //User exists
          errors.push({ msg: "Email is already registered" });
          res.render("register", {
            errors,
            name,
            email,
            password,
            password2,
            address,
            contact,
            role,
          });
        } else {
          const newUser = new Charity({
            name,
            email,
            password,
            address,
            contact,
            role,
          });

          //Hash password
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
              if (err) throw err;

              //Set password to hashed
              newUser.password = hash;

              newUser
                .save()
                .then(function (user) {
                  req.flash(
                    "success_msg",
                    "Signup is successful and you can login!"
                  );
                  res.redirect("/login");
                })
                .catch(function (err) {
                  console.log(err);
                });
            });
          });
        }
      });
    }
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/register",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out!");
  res.redirect("/login");
});

module.exports = router;
