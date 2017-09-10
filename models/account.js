var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/*
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
  username: String,
  password: String
});

Account.plugin(passportLocalMongoose);
module.exports = mongoose.model('Account', Account);
*/


var accountSchema = new Schema({
  id: String,
	username: String,
	password: String,
	email: String,
	firstName: String,
  lastName: String

});

accountSchema.methods.dudify = function(){
  this.username = this.username + '-dude';
  return this.username;
}

var Account = mongoose.model('Account', accountSchema);
module.exports = Account;
