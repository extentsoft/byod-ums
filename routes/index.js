var express = require('express');
var passport = require('passport');
var Account = require('../models/account');

var router = express.Router();

var isAuthenticated = function(req,res,next){
  if( req.isAuthenticated())
    return next();

  res.redirect('/login');
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'User Management System', user: req.user });
});

router.get('/console', isAuthenticated, function(req, res, next) {
  res.render('console', { title: 'Console', user: req.user });
});

router.get('/device', isAuthenticated, function(req, res, next) {
  res.render('device', { title: 'Device', user: req.user });
});

router.get('/vendroid_html/device', isAuthenticated, function(req, res, next) {
  res.render('device', { title: 'Device', user: req.user });
});

router.get('/user', isAuthenticated, function(req, res, next) {
  res.render('user', { title: 'User', user: req.user });
});


router.get('/login', (req, res) => {
  res.render('login', { user : req.user, error : req.flash('error')});
});

/*
router.post('/login', function(req, res, next) {
  passport.authenticate('login', {session: false}, function(err, user, info) {
    if (err) {
      console.log('Error Authentication');
      return next(err);
    }
    if (!user) {
      return res.json(info);
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.json(info);
    });
  })(req, res, next);
});
*/
router.post('/login', passport.authenticate('login', {
	successRedirect: '/dashboard',
	failureRedirect: '/login',
	failureFlash : true
}));

/* GET Registration Page */
router.get('/signup', function(req, res){
	res.render('register',{message: req.flash('message')});
});

/* Handle Registration POST */
router.post('/signup', passport.authenticate('signup', {
	successRedirect: '/dashboard',
	failureRedirect: '/signup',
	failureFlash : true
}));


router.get('/logout', (req, res, next) => {
  req.logout();
  req.session.save( (err) => {
    if(err){
      return next(err);
    }
    res.redirect('/');
  })
});

router.get('/ping', (req, res) => {
  //res.status(200).send("pong !");
  res.send(Account.find)
});

module.exports = router;
