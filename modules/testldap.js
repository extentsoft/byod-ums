var OpenLDAP = require('../config/openldap');

var Crypt = require('./crypt_sha');
var crypt = new Crypt();


console.log(crypt.generateSHA('password', ''));