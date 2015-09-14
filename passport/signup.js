'use strict';

var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function (passport) {

        passport.use('signup', new LocalStrategy({
            passReqToCallback : true
        },
        function (req, username, password, done) {
            var findOrCreateUser = function(){
                //find user in database via username

                User.findOne({'username' :  username}, function (err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in SignUp: ');
                        console.log(err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: ');
                        console.log(username);
                        return done(null, false, req.flash('message','User Already Exists'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();

                        // set the user's local credentials
                        newUser.username = username;
                        newUser.password = createHash(password);
                        newUser.email = req.param('email');

                        // save the user
                        newUser.save(function(err) {
                            if (err){
                                console.log('Error in Saving user: ');
                                console.log(err);
                                throw err;
                            }
                            console.log('User Registration succesful');
                            return done(null, newUser);
                        });
                    }
                });
            };

            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // generate Hash with bCrypt:
    var createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };
};