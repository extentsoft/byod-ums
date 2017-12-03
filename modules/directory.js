var envConfig = require('../config/environment');
var OpenLdapCfg = require('./config/openldap');

var ldap = require('ldapjs')
var OpenLdap = require('./modules/openldap');

var openldap = new OpenLdap();

var Directory = function(){};

Directory.prototype.checkPassword = function(){
    openldap.bind();
    openldap.bind();
}


Directory.prototype.isExist = function(){

}

modules.export =  Directory;
