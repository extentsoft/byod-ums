module.exports = function(app, passport){

  app.get('/admin/', function(req,res){
    //res.send('/admin');
    res.render('admin/index', {title: 'Administrative Console'});
  });

  app.get('/admin/login', (req, res) => {
    res.render('admin/login', { user : req.user, error : req.flash('error')});
  });


  app.get('/admin/device', function(req,res,next){
    res.render('admin/device', {title: 'Administrative Console - Devices'});
  });
  app.get('/admin/user', function(req,res,next){
    res.render('admin/user', {title: 'Administrative Console - Users'});
  });
  app.get('/admin/dashboard', function(req,res,next){
    res.render('admin/dashboard', {title: 'Administrative Console - Dashboard'});
  });

  // LOGOUT ==============================
  app.get('/admin/logout', function(req, res){
    req.logout();
    res.redirect('/admin/login');
  });


  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/admin/login', function(req, res) {
    res.render('admin/login', { user : req.user, error : req.flash('error')});

    //res.render('profile/login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/admin/login', passport.authenticate('local-login', {
      successRedirect : '/admin', // redirect to the secure profile section
      failureRedirect : '/admin/login', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/admin/signup', function(req, res) {
      res.render('admin/register.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/admin/signup', passport.authenticate('local-signup', {
      successRedirect : '/admin', // redirect to the secure profile section
      failureRedirect : '/admin/signup', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  console.log('Authenticating');
  if (req.isAuthenticated())
    return next();

  res.redirect('/admin/login');
}
