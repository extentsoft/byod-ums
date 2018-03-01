// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var request = require('request');
// load up the user model
var Account = require('../models/account');


// load the auth variables
// var configAuth = require('./auth'); // use this one for testing

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        Account.findById(id, function(err, user) {
            done(err, user);
        });

    });

    // =========================================================
    // LOCAL LOGIN =============================================
    // =========================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    }, function(req, username, password, done) {
        // asynchronous
        process.nextTick(function() {
            // Work method
            var opts = {
                uid: username,
                email: username,
                password: password
            }

            Account.test(opts, function(err, user) {
                console.log('@passport_local file');
                console.log(' passport check type - ' + typeof(err));
                console.log(' passport check type - ' + typeof(user));

                // if there are any errors, return the error
                if (err instanceof Error) {
                    console.log('Authentication has been malfunctioned');
                    //return done(null, false, req.flash('loginMessage', 'No user found.'));
                    return done(err);
                } else {
                    console.log('Authentication Success');
                    console.log(user.email);
                    console.log(user.password);
                    //var AC = require('../app/models/account');
                    Account._id = user._id;
                    Account.email = user.email;
                    Account.password = user.password;


                    console.log('Identity is being authorizing against e-Office');
                    request('http://localhost/api/eoffice/profile/' + Account.email, function(error, response, body) {

                        if (!error && response.statusCode == 200) {
                            if (body != null) {
                                //Authorization Done
                                parsed_body = JSON.parse(body);
                                Account.firstname = parsed_body.fn;
                                Account.lastname = parsed_body.ln;
                                Account.ssn = parsed_body.ssn;
                                Account.position = parsed_body.position;
                                Account.level = parsed_body.level;
                                Account.area = parsed_body.area;
                                Account.authorized = parsed_body.authorized;

                                request('http://localhost/api/getuserpref?accname=' + Account.email, function(error, response, body) {
                                    if (!error && response.statusCode == 200) {
                                        if (body != null) {
                                            var parsed_body = JSON.parse(body);
                                            console.log("profiling --> " + parsed_body[0]);
                                            console.log("profiling --> " + parsed_body[1]);

                                            Account.pref_theme = parsed_body[0];
                                            Account.pref_notification = parsed_body[1];

                                            return done(null, Account);
                                        } else {
                                            console.log("2");
                                            return done(null, false, req.flash('loginMessage', 'Profiling Failure'));
                                        }
                                    } else {
                                        console.log("3");
                                        return done(null, false, req.flash('loginMessage', 'Profiling Failure'));
                                    }

                                });

                                // If only authentication & authorization are enough, comment out below line
                                //return done(null, Account);

                            } else {
                                //No authorization
                                return done(null, false, req.flash('loginMessage', 'Authorizing Failure'));
                            }

                        } else {
                            //if ERRROR happens once authorizing 
                            return done(null, false, req.flash('loginMessage', 'Authorizing Failure'));
                        }
                    })

                    // If only authentication is needed, comment out below line 
                    //return done(null, Account); 
                }
            });


        });
    }));


};