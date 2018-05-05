var ldap = require('ldapjs');
var envConfig = require('../config/environment');
var LdapCfg = require('../config/openldap');
var Crypt = require('./crypt_sha');
var crypt = new Crypt();

var client;

var OpenLdap = function(){
  client = ldap.createClient({
    url: LdapCfg[envConfig.environment]['url']
  });
  console.log('constructor called');
  this.bind();
};


OpenLdap.prototype.test = function(params, done){


  var opts = {
    filter: 'uid=' + params.uid,
    //filter: '(&(uid='+ params.uid + ')(userPassword={SHA}LmIAac5WRrZRdvvsVGhNzkuJCiI=))',
    scope: 'sub',
    attributes: []
  };

  client.search(LdapCfg[envConfig.environment]['baseDN'], opts, function(err,res){
    if(err){
      console.log('Searching error : ' + err);
      done(new Error('Connection failure'));
    }
    var tmp;
    // 1st step
    res.on('searchEntry', function(entry) {
      console.log('authenticated');
      console.log('entry: ' + JSON.stringify(entry.object));
      tmp = entry.object;
    });

    res.on('searchReference', function(referral) {
      console.log('referral: ' + referral.uris.join());
    });
    res.on('error', function(err) {
      console.error('error: ' + err.message);
      done(new Error('Connection failure'));
    });

    //2nd step
    res.on('end', function(result) {
      console.log('searched');

      if( typeof(tmp) === "undefined"){
          console.log('no user');
          done(new Error('No user found'));
      }
      else{
        if(crypt.checkPassword(params.password, tmp.userPassword)){
          console.log('Credential Matched');
          done(tmp);
        }
        else{
          console.log('Incorrect Password');
          done(new Error('Incorrect Password'));
        }
      }
    });
  });
};

OpenLdap.prototype.bind = function(){
  client.bind(LdapCfg[envConfig.environment]['rootDN'],LdapCfg[envConfig.environment]['rootPassword'],function(err){
    if(err) console.log('Binding with error : ' + err);

    console.log('successfully binded');
  });
};

OpenLdap.prototype.unbind = function(){
  client.unbind(function(err){
    if(err){
      done('Unbind error ' + err);
    }
    else{
      console.log("successfully unbinded");
    }
  });
};

OpenLdap.prototype.search = function(username, done){
  var opts = {
    filter: 'uid='+ username,
    scope: 'sub',
    attributes: []
  };

  client.search(LdapCfg[envConfig.environment]['baseDN'], opts, function(err,res){
    if(err){
      console.log('Searching error : ' + err);
    }
    var tmp;
    // 1st step
    res.on('searchEntry', function(entry) {
      console.log('authenticated');
      console.log('entry: ' + JSON.stringify(entry.object));
      tmp = entry.object;
    });

    res.on('searchReference', function(referral) {
      console.log('referral: ' + referral.uris.join());
    });
    res.on('error', function(err) {
      console.error('error: ' + err.message);
      done(new Error('Connection failure'));
    });

    //2nd step
    res.on('end', function(result) {
      console.log('searched');

      if( typeof(tmp) === "undefined"){
          console.log('no user');
          done(new Error('No user found'));
      }
      else{
          done(tmp);
      }

    });
  });
};

OpenLdap.prototype.blindsearch = function(accountPattern, done){
  var opts = {
    filter: accountPattern,
    scope: 'sub',
    attributes: []
  };

  client.search(LdapCfg[envConfig.environment]['baseDN'], opts, function(err,res){
    if(err){
      console.log('Searching error : ' + err);
    }
    var tmp;
    // 1st step
    res.on('searchEntry', function(entry) {
      console.log('authenticated');
      console.log('entry: ' + JSON.stringify(entry.object));
      tmp = entry.object;
    });

    res.on('searchReference', function(referral) {
      console.log('referral: ' + referral.uris.join());
    });
    res.on('error', function(err) {
      console.error('error: ' + err.message);
      done(new Error('Connection failure'));
    });

    //2nd step
    res.on('end', function(result) {
      console.log('searched');

      if( typeof(tmp) === "undefined"){
          console.log('no user');
          done(new Error('No user found'));
      }
      else{
          done(tmp);
      }

    });
  });
};

OpenLdap.prototype.authenticate = function(username, password, done){
  this.search(username,function(userInfo){
    console.log(userInfo);

    if(typeof(userInfo) === "undefined"){
      done(new Error('xxxx'));
    }
    else{
      //userInfo.mail === "guest1@zflexsoftware.com"
      if(userInfo.mail === password){
      //if(userInfo.userPassword === "{SSHA}fwfwefwfw"){
        console.log('')
        done(userInfo);
      }
      else{
        done(new Error('YYYY'));
      }
    }
  });
};


module.exports = OpenLdap;
