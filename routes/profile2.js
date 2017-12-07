module.exports = function(app, passport){
  app.get('/', function(req,res){
    res.send('profile ');
  });

  app.get('/profile', isLoggedIn, function(req,res){
    console.log('done /profile');
    console.log(req.user.email);
    //res.send('profile');
    res.render('profile/index', {title: 'Personal Profile'});
  });


  app.get('/profile/device', function(req, res){
  	res.render('profile/device',{title: 'Personal Profile', message: req.flash('message')});
  });

  app.get('/profile/setting', function(req, res){
  	res.render('profile/setting',{title: 'Personal Profile', message: req.flash('message')});
  });

  app.get('/profile/history', function(req, res){
  	res.render('profile/history',{title: 'Personal Profile', message: req.flash('message')});
  });


  // LOGOUT ==============================
  app.get('/profile/logout', function(req, res){
    req.logout();
    res.redirect('/profile/login');
  });


  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/profile/login', function(req, res) {
    res.render('profile/login', { user : req.user, error : req.flash('error')});

    //res.render('profile/login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/profile/login', passport.authenticate('local-login', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/profile/login', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/profile/signup', function(req, res) {
      res.render('register.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/profile/signup', passport.authenticate('local-signup', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/signup', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  console.log('Authenticating');
  if (req.isAuthenticated())
    return next();

  res.redirect('/profile/login');
}
