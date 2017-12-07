// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;

// load up the user model
var Account = require('../models/account');

// load the auth variables
// var configAuth = require('./auth'); // use this one for testing

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  passport.deserializeUser(function(id, done) {
    Account.findById(id, function(err,user){
      done(err, user);
    });
  });

  // =========================================================
  // LOCAL LOGIN =============================================
  // =========================================================
  
  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  }, function(req, username, password, done) {
    // asynchronous
    process.nextTick(function() {
      /*
      if( email === 'Natthawat_a' ){
        return done(null, Account);
      }
      else{
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      }
      */

      var opts = {
        uid: username,
        email: username,
        password: password
      }

      Account.test(opts, function(err,user){
        console.log('@passport_local file');


        if( err instanceof Error ){
          console.log('Error');
          return done(null, false, req.flash('loginMessage', 'No user found.'));
        }
        else{
          console.log('Success');
          console.log(user.email);
          console.log(user.password);
          //var AC = require('../app/models/account');
          Account._id = user._id;
          Account.email = user.email;
          Account.password = user.password;
          return done(null, Account);
        }
      });

      /*
      Account.findOne({'email' : email}, function(err,user){
        console.log('findOne');
        if(err instanceof Error){
          return done(null, false, req.flash('loginMessage', 'No user found.'));
        }
        else{
          return done(null, user);
        }
      });
      */
    });
  }));
};
