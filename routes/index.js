const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

//User model
const User = require('../models/User');

//Register handle
router.post('/register', function(req, res) {
    const { name, email, password, password2, address, contact, role } = req.body;
    let errors = [];

    //Check required fields
    if(!name || !email || !password || !password2 || !address || !contact || !role) {
        errors.push({ msg: 'Please fill in all the fields' });
    }

    //Check password length
    else if(password.length < 6) {
        errors.push({ msg: 'Password should atleast be 6 characters long' });
    }

    //Check if passwords match
    else if(password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if(errors.length > 0) {
        console.log(errors);
    } else {
        //Validation passed
        User.findOne({ email: email })
            .then(function (user) {
                if(user) {
                    //User exists
                    errors.push({ msg: 'Email is already registered' });
                } else {
                    const newUser = new User ({
                        name,
                        email,
                        password,
                        address,
                        contact,
                        role
                    });

                    //Hash password
                    bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(newUser.password, salt, function(err, hash) {
                            if(err) throw err;

                            //Set password to hashed
                            newUser.password = hash;

                            newUser.save()
                                .then(function(user) {
                                    res.redirect('/login');
                                })
                                .catch(function(err) {
                                    console.log(err);
                                });
                        });
                    });
                }
            });
    }
});

module.exports = router;