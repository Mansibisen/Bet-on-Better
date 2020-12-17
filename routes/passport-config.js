const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { stat } = require("fs");

// Load User model
//const User = require('../models/User');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy(
            { usernameField: "email" },
            (email, password, done) => {
                // Match user
                User.findOne({
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
            }
        )
    );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};
