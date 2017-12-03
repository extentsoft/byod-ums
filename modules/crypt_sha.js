var crypto = require('crypto');

/*
slappasswd -h {SHA} -s password
{SHA}W6ph5Mm5Pz8GgiULbPgzG37mj9g=

slappasswd -h {SSHA} -s password
{SSHA}aBKF48heZ6/evLWfdfcuH1EIR00jMKzN

slappasswd -h {SSHA} -s Nattha501
{SSHA}pSwicOfZpLXwXRoSi0+22GlP+FXY8cxm

slappasswd -h {SHA} -s Nattha501
{SHA}LmIAac5WRrZRdvvsVGhNzkuJCiI=
*/

var Crypt = function(){};

// return raw SHA1 string
function generateSHA1(passwd,salt){
  //console.log('generating SHA1');
  var ctx = crypto.createHash('sha1');
  ctx.update(passwd, 'utf-8');
  ctx.update(salt, 'binary');
  var digest = ctx.digest('binary');
  var sha = new Buffer(digest+salt,'binary').toString('base64');
  return sha;
}

// return {SSHA} format string - DONE
Crypt.prototype.generateSSHA = function(password, salt){
  return "{SSHA}" + generateSHA1(password,salt);
}

// return {SHA} format string - CHECKING
//function generateSHA(password, salt, done){
Crypt.prototype.generateSHA = function(password, salt){
  return "{SHA}" + generateSHA1(password,'');
}


/*
password =  Nattha501
hash = {SSHA}pSwicOfZpLXwXRoSi0+22GlP+FXY8cxm
*/
Crypt.prototype.checkPassword = function(password, hash){

  if(hash.substr(0,6) === '{SSHA}') {
    var bhash = new Buffer(hash.substr(6),'base64');
    var salt = bhash.toString('binary',20); // sha1 digests are 20 bytes long
    //Create SSHA for considering password with extracted salt
    passwordHash = this.generateSSHA(password,salt);
    if( passwordHash === hash) return true;
    else return false;
  }
  else if(hash.substr(0,5) === '{SHA}'){
    //Create SHA for considering password by ignoring salt
    passwordHash = this.generateSHA(password,null);
    if( passwordHash === hash) return true;
    else return false;

  }


}

module.exports = Crypt;
