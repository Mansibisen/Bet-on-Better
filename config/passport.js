const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

//Load DB models
const Donor = require("../models/Donor");
const Charity = require("../models/Charity");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match user
      Donor.findOne({
        email: email,
      }).then((user) => {
        if (!user) {
          Charity.findOne({
            email: email,
          }).then((user) => {
            if (!user) {
              console.log("User Not Registered");
              return done(null, false, {
                message: "User Not Registered",
              });
            }
            // Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                console.log(user);
                return done(null, user);
              } else {
                console.log("Password Incorrect");
                return done(null, false, {
                  message: "Password Incorrect",
                });
              }
            });
          });
        } else {
          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              console.log(user);
              return done(null, user);
            } else {
              console.log("Password Incorrect");
              return done(null, false, {
                message: "Password Incorrect",
              });
            }
          });
        }
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    try {
      Donor.findById(id, function (err, user) {
        done(err, user);
      });
    } catch (err) {
      console.log(err);
      Charity.findById(id, function (err, user) {
        done(err, user);
      });
    }
  });
};
