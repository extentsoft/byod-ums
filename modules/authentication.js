var ldap = require('ldapjs');
var envConfig = require('../config/environment');
var OpenLDAP = require('../config/openldap');

var Authentication = function(){};

var client = ldap.createClient({
  url: OpenLDAP[envConfig.environment]['url']
});

Authentication.prototype.greeting = function(name){
  return "Authentication " + name;
}

Authentication.prototype.authenticate = function(username,password,done){
  console.log('authenticating');
  client.bind(OpenLDAP[envConfig.environment]['rootDN'],OpenLDAP[envConfig.environment]['rootPassword'],function(err){
    console.log('Binding with error : ' + err);
  });
  var opts = {
    //filter: '(&(l=Seattle)(email=*@foo.com))',
    //attributes: ['dn', 'sn', 'cn']

    filter: 'uid='+ username,
    //filter: '(&(uid='+ username + ')(userPassword={SSHA}fwfwefwfw)',
    scope: 'sub',
    attributes: []
  };
  client.search(OpenLDAP[envConfig.environment]['baseDN'], opts, function(err,res){
    res.on('searchEntry', function(entry) {
      console.log('authenticated');
      console.log('entry: ' + JSON.stringify(entry.object));
      client.unbind(function(err){
        console.log("unbind LDAP server");
        done();
      });
    });
    res.on('searchReference', function(referral) {
      console.log('referral: ' + referral.uris.join());
    });
    res.on('error', function(err) {
      console.error('error: ' + err.message);
      done(new Error('Authentication failure'));
    });
    res.on('end', function(result) {
      console.log('status: ' + result.status);
    });
  });
}

module.exports = Authentication;
