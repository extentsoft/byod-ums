module.exports = function(app, passport){
  app.get('/', function(req,res){
    res.send('profile ');
  });

  app.get('/profile', isLoggedIn, function(req,res){
    console.log('done /profile');
    res.send('profile');
  });

  // LOGOUT ==============================
  app.get('/profile/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });


  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/profile/login', function(req, res) {
      res.render('profile/login.ejs', { message: req.flash('loginMessage') });
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
