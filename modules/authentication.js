var ldap = require('ldapjs');
var envConfig = require('../config/environment');
var OpenLDAP = require('../config/openldap');

var Crypt = require('./crypt_sha');
var crypt = new Crypt();

var client = ldap.createClient({
  url: OpenLDAP[envConfig.environment]['url']
});

var Authentication = function(){
  client.bind(OpenLDAP[envConfig.environment]['rootDN'],OpenLDAP[envConfig.environment]['rootPassword'],function(err){
    console.log('Binding with error : ' + err);
  });
};

Authentication.prototype.greeting = function(name){
  return "Authentication " + name;
}

Authentication.prototype.authenticate = function(username,password,done){
  console.log('authenticating');

  var opts = {
    //filter: '(&(l=Seattle)(email=*@foo.com))',
    //attributes: ['dn', 'sn', 'cn']

    filter: 'uid='+ username,
    //filter: '(&(uid='+ username + ')(userPassword={SSHA}fwfwefwfw)',
    scope: 'sub',
    attributes: []
  };
  client.search(OpenLDAP[envConfig.environment]['baseDN'], opts, function(err,res){
    var tmp;
    res.on('searchEntry', function(entry) {

      tmp = entry;
      console.log('authenticated');
      console.log('entry: ' + JSON.stringify(entry.object));

      console.log(crypt.checkPassword(password, entry.object.userPassword));
      console.log('entry: ' + entry.object.userPassword);
      /*
      entry: {"dn":"uid=guest1,ou=users,ou=guests,dc=zflexsoftware,dc=com","controls":[],"objectClass":["top","person","organizationalPerson","inetOrgPerson"],"givenName":"Guest","uid":"guest1","mail":"guest1@zflexsoftware.com","employeetype":"temp","departmentNumber":"0001","displayname":"Guest1 NumberOne","employeeNumber":"11003","cn":"Guest Number One","sn":"Number One","l":"Boston","pager":"303-223-9876","facsimileTelephoneNumber":"330-333-3342","mobile":"909-983-4552","street":"403 Anywhere Lane","postalCode":"30994","postalAddress":"3088 NewMain Street","title":"Contractor1"}
      */
      if( crypt.checkPassword(password, entry.object.userPassword) ){
        tmp = entry;
      }
      else{
        tmp = new Error('Password incorrect');
      }
    });
    res.on('searchReference', function(referral) {
      console.log('referral: ' + referral.uris.join());
    });
    res.on('error', function(err) {
      console.error('error: ' + err.message);
      done(new Error('Connection failure'));
    });
    res.on('end', function(result) {
      client.unbind(function(err){
        console.log('status: ' + result.status);
        console.log("unbind LDAP server");
        done(tmp);
      });

    });
  });
}

module.exports = Authentication;
