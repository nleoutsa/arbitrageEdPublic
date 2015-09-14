'use strict';

var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function (passport) {

        passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
            // does user exist in database?
            User.findOne({ 'username': username },
                function(err, user) {
                    // return if error
                    if (err) {
                        return done(err);
                    }
                    // log error message and return if no user
                    if (!user) {
                        console.log('No user with username: '+username);
                        return done(null, false, req.flash('message', 'User not found...'));
                    }
                    // wrong password? log error, redirect to login page
                    if (!isValidPassword(user, password)) {
                        console.log('Password Invalid');
                        return done(null, false, req.flash('message', 'Password Invalid'));
                    }
                    // if no errors, user and password match, success, return user
                    return done(null, user);

                }
            );
        })
    );

    var isValidPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);
    };
};