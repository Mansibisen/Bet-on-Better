const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

//Load DB models
const Donor = require("../models/Donor");
const Charity = require("../models/Charity");

module.exports = function (passport) {
	passport.use("donor",new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
		Donor.findOne({email}, (err, user) => {
			if(err) throw err;
			if(!user) return done(null, false, { message: "User Not Registered" });
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
	}));

	passport.use("charity",new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
		Charity.findOne({email}, (err, user) => {
			if(err) throw err;
			if(!user) return done(null, false, { message: "User Not Registered" });
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
	}));

  passport.serializeUser(function (user, done) {
	console.log({serializeUser:user.id});
	done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
	  Charity.findById(id, (err, user) => {
		  if(user) {
			done(err, user);
		  } 
		  else {
			Donor.findById(id, (err, user) => {
				done(err, user);
			});
		  }
	  });
  });
};
