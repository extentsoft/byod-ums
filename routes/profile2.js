var nodemailer = require('nodemailer');
var Crypt = require('../modules/crypt_sha');
var crypt = new Crypt();
module.exports = function(app, passport){

  app.get('/profile/notification', function(req,res){
    res.json([{ message: "1", duration: "20"},{ message: "2", duration: "30"}]);
  });

  app.get('/', isLoggedIn, function(req,res){
    res.render('profile/index', {
      title: 'Personal Profile',
      user_id: req.user.email,
      user_cn: req.user.email
    });
  });

  app.get('/profile', isLoggedIn, function(req,res){
    console.log('done /profile');
    console.log(req.user.email);
    //res.send('profile');
    res.render('profile/index', {
      title: 'Personal Profile',
      user_id: req.user.email,
      user_cn: req.user.email
    });
  });


  app.get('/profile/device', isLoggedIn, function(req, res){
  	res.render('profile/device',{
      title: 'Personal Profile',
      message: req.flash('message'),
      user_id: req.user.email,
      user_cn: req.user.email
    });
  });

  app.get('/profile/device/add', function(req, res){
    res.send('Add device service');
    //res.render('profile/device',{title: 'Personal Profile', message: req.flash('message')});
  });
  app.get('/profile/device/delete', function(req, res){
    res.send('Delete device service');
    //res.render('profile/device',{title: 'Personal Profile', message: req.flash('message')});
  });

  app.get('/profile/preference', function(req, res){
    res.send('GET /profile/preference');
  	//res.render('profile/device',{title: 'Personal Profile', message: req.flash('message')});
  });
  app.post('/profile/preference', function(req, res){
    res.send('POST /profile/preference');
  	//res.render('profile/device',{title: 'Personal Profile', message: req.flash('message')});
  });

  app.get('/profile/notification', function(req, res){
    res.json([{_id: 123, message: 'Hello'},{_id: 124, message: 'Bye'} ]);
  	//res.render('profile/device',{title: 'Personal Profile', message: req.flash('message')});
  });

  app.get('/profile/message', function(req, res){
    res.send('GET /profile/message');
    //res.json([{_id: 123, message: 'Hello'},{_id: 124, message: 'Bye'} ]);
  });
  app.post('/profile/message', function(req, res){
    res.send('POST /profile/message');
    //res.json([{_id: 123, message: 'Hello'},{_id: 124, message: 'Bye'} ]);
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
    console.log('xxsdwfw');
    res.render('profile/register.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/profile/signup', passport.authenticate('local-signup', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/signup', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));

  // process the signup form
  app.get('/profile/forgotpwd', function(req,res){
    res.render('profile/forgotpwd', {title:'wefw', message: req.flash('signupMessage') });
  });

  app.post('/profile/sendemail', function(req,res){

    //console.log('email : ' + req.body.email);



    var newpass = makeid();
    var newhash = crypt.generateSSHA(newpass,'')
    console.log(newpass);
    console.log(newhash);

    const mailOptions = {
      from: 'BYODatExcise@gmail.com', // sender address
      to: req.body.email, // list of receivers
      subject: 'Password Reset', // Subject line
      html: '<p>Please sign in with generated password: ' + newpass + '</p>'// plain text body
    };


    var transporter = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '59ad65f3b7fa3b',
        pass: '7e4387ba355422'
      }
    });
    transporter.sendMail(mailOptions, function (err, info) {
      if(err){
        console.log(err)
        console.log('ERROR');
      }
      else{
        console.log(info);
        console.log('Success');
      }
      res.redirect('/profile/login');
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  console.log('Authenticating');
  if (req.isAuthenticated())
    return next();

  res.redirect('/profile/login');
}

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
