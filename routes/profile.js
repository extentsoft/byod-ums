var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var Authentication = require('../modules/authentication');
var auth = new Authentication();

var router = express.Router();
///////////////////////////////////////////////////////////////////////////
var isAuthenticated = function(req,res,next){
  if( req.isAuthenticated())
    return next();
  res.redirect('/profile/login');
}
///////////////////////////////////////////////////////////////////////////
router.get('/', isAuthenticated, function(req,res,next){
  res.render('profile/index', {title: 'Personal Profile'});
});
router.get('/login', (req, res) => {
  res.render('profile/login', { user : req.user, error : req.flash('error')});
});
/*
router.post('/login', passport.authenticate('login', {
	successRedirect: '/profile/',
	failureRedirect: '/profile/login',
	failureFlash : true
}));
*/
var myAuthentication = function(req,res,next){
  if( ! envConfig.bypass ){
    auth.authenticate(req.body.username,req.body.password,next);
  }
  next();
};

router.post('/login', myAuthentication, function(req,res,next){
  res.render('profile/', {message: req.flash('message')});
});

router.get('/logout', (req, res, next) => {
  req.logout();
  req.session.save( (err) => {
    if(err){
      return next(err);
    }
    res.redirect('/profile');
  })
});
///////////////////////////////////////////////////////////////////////////
/* GET Registration Page */
router.get('/signup', function(req, res){
	res.render('profile/register', {message: req.flash('message')});
});

router.get('/device', function(req, res){
	res.render('profile/device');
});

/* Handle Registration POST */
router.post('/signup', passport.authenticate('signup', {
	successRedirect: '/profile/',
	failureRedirect: '/profile/signup',
	failureFlash : true
}));
///////////////////////////////////////////////////////////////////////////
router.get('/ping', (req, res) => {
  res.status(200).send("pong !");
  //res.send(Account.find)
});
router.get('/test', function(req,res,next){
  res.send('Test Passed !');
})

module.exports = router;
