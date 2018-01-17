var nodemailer = require('nodemailer');
var Crypt = require('../modules/crypt_sha');
var crypt = new Crypt();
var OpenLdap = require('../modules/openldap');
var openldap = new OpenLdap();
var ldap = require('ldapjs');

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
    // Check LDAP Account
    var newAccount = req.params.firstname + '.' + req.params.lastname.substring(0,1);
    console.log(newAccount);
    openldap.search(newAccount, function(entry){
      if( entry instanceof Error){
        // If not existed, then create it
        var client = ldap.createClient({
          url: 'ldap://192.168.163.31:389'
        });

        var rootDN = "cn=ldapadm,dc=excise,dc=go,dc=th";
        var rootPassword = "P@ssw0rd";
        var baseDN = "ou=People,dc=excise,dc=go,dc=th";

        var newDN = "uid=" + newAccount + ",ou=People,dc=excise,dc=go,dc=th";
        var newEntry = {
          uid: newAccount,
          cn: newAccount,
          sn: newAccount,
          objectClass: [ "top", "inetOrgPerson", "shadowAccount"],
          userPassword: "{SSHA}aBKF48heZ6/evLWfdfcuH1EIR00jMKzN" // password
        };

        client.bind(rootDN, rootPassword, function(err) {
          console.log(err);
          console.log("Bind Successful");
        });

        client.add(newDN,newEntry,function(err){
          console.log(err);
          client.unbind(function(err){
            console.log("unbind LDAP server");
          });
        });
      }
      next();
    });
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
