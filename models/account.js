var bcrypt   = require('bcrypt-nodejs');
var OpenLdap = require('../modules/openldap');
var openldap = new OpenLdap();

var Account = function(){
  var _id;
  var email;
  var password;
  /*
  this._id = '12021';
  this.email = 'guest1@ums.com';
  this.password = '123456';
  this._id = _id;
  this.email = email;
  this.password = password;*/

}
//findById(id, function(err, user))
Account.prototype.findById = function(id, done){
  //done(err, user);
  done(null, this);
};

Account.prototype.findOne = function(opts, done){
  console.log("prototype findOne : " +  opts.email);
  console.log(this);
  //done(err, user);


  openldap.search(opts.email, function(entry){
    if( entry instanceof Error){
      console.log('Error');
      done(entry,null);
      return;
    }
    console.log('After error');
    //console.log(entry);
    this._id = entry.uid;
    this._email = entry.mail;
    this.password = '{SHA}{SSHA}pSwicOfZpLXwXRoSi0+22GlP+FXY8cxm';
    //console.log(this);
    return done(null,this);
  });


};

// done = function(err,user)
Account.prototype.test = function(opts, done){
  openldap.test(opts, function(entry){
    if( entry instanceof Error){
      console.log('Error');
      return done(new Error('Error'), null);
    }
    else{
      console.log('not error');
      //console.log(entry);
      console.log(this.email);
      this._id = entry.uid;
      this.email = entry.uid;
      this.password = entry.userPassword;
      console.log('rewriting value');
      console.log(this.email);

      return done(null, this);
    }
  });
};

module.exports = new Account();
