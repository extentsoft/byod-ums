var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var envConfig = require('../modules/environment');
var Authentication = require('../modules/authentication');
var auth = new Authentication();
var router = express.Router();
///////////////////////////////////////////////////////////////////////////
var isAuthenticated = function(req,res,next){
  if( req.isAuthenticated())
    return next();

  res.redirect('/admin/login');
}
///////////////////////////////////////////////////////////////////////////
router.get('/', isAuthenticated, function(req,res,next){
  res.render('admin/index', {title: 'Administrative Console'});
});
router.get('/login', (req, res) => {
  res.render('admin/login', { user : req.user, error : req.flash('error')});
});

/*
router.post('/login', passport.authenticate('login', {
	successRedirect: '/admin/',
	failureRedirect: '/admin/login',
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
  res.render('admin/', {message: req.flash('message')});
});


router.get('/logout', (req, res, next) => {
  req.logout();
  req.session.save( (err) => {
    if(err){
      return next(err);
    }
    res.redirect('/admin');
  })
});
///////////////////////////////////////////////////////////////////////////
/* GET Registration Page */
router.get('/signup', function(req, res){
	res.render('admin/register', {message: req.flash('message')});
});

/* Handle Registration POST */
router.post('/signup', passport.authenticate('signup', {
	successRedirect: '/admin/',
	failureRedirect: '/admin/signup',
	failureFlash : true
}));
///////////////////////////////////////////////////////////////////////////
router.get('/device', function(req,res,next){
  res.render('admin/device', {title: 'Administrative Console - Devices'});
});
router.get('/user', function(req,res,next){
  res.render('admin/user', {title: 'Administrative Console - Users'});
});
router.get('/dashboard', function(req,res,next){
  res.render('admin/dashboard', {title: 'Administrative Console - Dashboard'});
});
///////////////////////////////////////////////////////////////////////////
router.get('/ping', (req, res) => {
  res.status(200).send("pong !");
  //res.send(Account.find)
});
router.get('/test', function(req,res,next){
  res.send('Test Passed !');
})

module.exports = router;
