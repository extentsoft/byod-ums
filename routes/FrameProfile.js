var nodemailer = require('nodemailer');
var Crypt = require('../modules/crypt_sha');
var crypt = new Crypt();

module.exports = function(app){
/*
  app.param('profile', function(req, res, next, profile){
    console.log(profile);
    next();
  });

  ///fprofile/device/1100922402884,thanakorn,santuary,501,2,4,5
  app.get('/fprofile/device/:profile', function(req, res, next){
    console.log('match');
    next();
  });

  app.get('/fprofile/device/:profile', function(req, res){

    res.send('Hi');
  });
*/
  // fprofile/device/110092240288/thanakorn/santuary/501/2/4/5
  app.param(['perno', 'firstname', 'lastname', 'position', 'level', 'group', 'area'], function(req,res,next,value){
    //console.log('new param');
    //console.log(value);
    next();
  });
  app.get('/fprofile/device/:perno/:firstname/:lastname/:position/:level/:group/:area', function(req,res,next){
    console.log('match');
    next();
  });
  app.get('/fprofile/device/:perno/:firstname/:lastname/:position/:level/:group/:area', function(req,res,next){
    //res.send('hi 2');
    res.render('fprofile/device',{
      title: 'Personal Profile',
      message: req.flash('message'),
      user_id: req.params.perno,
      user_cn: req.params.firstname + ' ' + req.params.lastname
    });
  });


/*
  app.get('/fprofile', isLoggedIn, function(req,res){
    res.render('fprofile/index', {
      title: 'Personal Profile',
      user_id: '2131231',
      user_cn: '1231321'
    });
  });

  app.get('/fprofile/device', isLoggedIn, function(req, res){
  	res.render('fprofile/device',{
      title: 'Personal Profile',
      message: req.flash('message'),
      user_id: '2131231',
      user_cn: '1231321'
    });
  });
  */
};

function isLoggedIn(req, res, next) {
  return next();
  /*console.log('Authenticating');
  if (req.isAuthenticated())
    return next();

  res.redirect('/profile/login');*/
}
