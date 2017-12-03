
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var bCrypt = require('bcrypt-nodejs');

var envConfig = require('./config/environment');


var index = require('./routes/index');
var admin = require('./routes/admin');
var profile = require('./routes/profile');

var listdevice = require('./routes/listdevice');
var listmac = require('./routes/listmac');
var updatemac = require('./routes/updatemac');
var adddevice = require('./routes/adddevice');
var deletedevice = require('./routes/deletedevice');
var alldevices = require('./routes/alldevices');
var allusers = require('./routes/allusers');
var report678 = require('./routes/reports/report678');
var report67152 = require('./routes/reports/report67152');
var report672 = require('./routes/reports/report672');
var report675 = require('./routes/reports/report675');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(require('express-session')({
  secret: 'keyword',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(flash());
app.use(passport.session({secret: 'byodatexcise.go.th'}));
app.use(express.static(path.join(__dirname, 'public')));

// Mongoose
//mongoose.connect('mongodb://admin2:123456@ds127994.mlab.com:27994/ums');

// Passport Configuration
var Account = require('./models/account');

/*
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
*/
passport.serializeUser(function(account, done) {
  console.log('serializing user: ');
  console.log(account);
  done(null, account._id);

});

passport.deserializeUser(function(id, done) {
  /*Account.findById(id, function(err, account) {
    console.log('deserializing user:',account);
    done(err, account);
  });*/

  done(null, {
    _id:'nattawat_a',
    username:'test1',
    password:'123456',
    email:'',
    firstName:'Natthawa',
    lastName:'Arun'
  });
});

/* Account test
user: test1
pass: 123456
*/
passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    //console.log(username);
    //console.log(password);



    // change to ldap
    if( username == 'test1' && password == "123456"){
      var user = {
        _id: 'nattawat_a',
        name: 'natthawat_a',
        phone: '1234444'
      };
      return done(null, user);
    }
    else{
      return done(null, false, req.flash('message', 'User Not found.'));
    }

    // check in mongo if a user with username exists or not
    /*
    Account.findOne({ 'username' :  username },
      function(err, account) {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!account){
          console.log('User Not Found with username '+username);
          return done(null, false,
                req.flash('message', 'User Not found.'));
        }
        // User exists but wrong password, log the error
        if (!isValidPassword(account, password)){
          console.log('Invalid Password');
          return done(null, false,
              req.flash('message', 'Invalid Password'));
        }
        // User and password both match, return user from
        // done method which will be treated like success
        return done(null, account);
      }
    );
    */
}));

var isValidPassword = function(account, password){
  /*if( account.password == password) return true;
  else return false;*/
  return bCrypt.compareSync(password, account.password);
}

passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                Account.findOne({ 'username' :  username }, function(err, account) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    // already exists
                    if (account) {
                        console.log('User already exists with username: '+username);
                        return done(null, false, req.flash('message','User Already Exists'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newAccount = new Account();

                        // set the user's local credentials
                        newAccount.username = username;
                        //newAccount.password = password;
                        newAccount.password = createHash(password);
                        newAccount.email = req.param('email');
                        newAccount.firstName = req.param('firstName');
                        newAccount.lastName = req.param('lastName');

                        // save the user
                        newAccount.save(function(err) {
                            if (err){
                                console.log('Error in Saving user: '+err);
                                throw err;
                            }
                            console.log('User Registration succesful');
                            return done(null, newAccount);
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
        var createHash = function(password){
    				//return password;
            return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
        }

app.use('/', profile);
app.use('/profile', profile);
app.use('/admin', admin);

app.use('/listdevice', listdevice);
app.use('/listmac', listmac);
app.use('/updatemac', updatemac);
app.use('/adddevice', adddevice);
app.use('/deletedevice', deletedevice);
app.use('/alldevices', alldevices);
app.use('/allusers', allusers);
app.use('/reports/report678', report678);
app.use('/reports/report67152', report67152);
app.use('/reports/report672', report672);
app.use('/reports/report675', report675);

var Crypt = require('./modules/crypt_sha');
var crypt = new Crypt();
console.log('Crypting process');
/*
crypt.checkPassword('Nattha501', '{SHA}LmIAac5WRrZRdvvsVGhNzkuJCiI=', function(result){
//crypt.checkPassword('Nattha501', '{SSHA}pSwicOfZpLXwXRoSi0+22GlP+FXY8cxm', function(result){
//crypt.checkPassword('password', '{SHA}W6ph5Mm5Pz8GgiULbPgzG37mj9g=', function(result){
//crypt.checkPassword('password', '{SSHA}aBKF48heZ6/evLWfdfcuH1EIR00jMKzN', function(result){
  console.log(result);
});
*/

console.log(crypt.checkPassword('Nattha501', '{SHA}LmIAac5WRrZRdvvsVGhNzkuJCiI='));
console.log(crypt.checkPassword('Nattha501', '{SSHA}pSwicOfZpLXwXRoSi0+22GlP+FXY8cxm'));
console.log(crypt.checkPassword('password', '{SHA}W6ph5Mm5Pz8GgiULbPgzG37mj9g='));
console.log(crypt.checkPassword('password', '{SSHA}aBKF48heZ6/evLWfdfcuH1EIR00jMKzN'));


console.log('Crypting done');

var OpenLdap = require('./modules/openldap');
var openldap = new OpenLdap();

var isAuthenticated = function(req, res, next){

  /*openldap.search('guest1', function(result){
    console.log('done callback and get back to main');
    console.log(result);
    if(result instanceof Error){
      console.log('Error');
      next(result);
    }
    else{
      console.log('Success');
      req.user = result;
      next();
    }
  });*/
  openldap.authenticate('ro_admin', 'guest1@zflexsoftware.com', function(result){
    console.log('done callback and get back to main');
    console.log(result);
    if(result instanceof Error){
      console.log('Error');
      next(result);
    }
    else{
      console.log('Success');
      req.user = result;
      next();
    }
  });

}

app.use('/testcallback', isAuthenticated, function(req,res,next){
  res.send('test callback');
});


app.get('/mon_create', function(req,res,next){
  var cz = new Account({
    id: 4,
    username: "cz",
    password: "123456"
  });

  cz.dudify(function(err, username){
    if(err) throw err;

    console.log('New account is ' + username);
  });
  cz.save(function(err){
    if(err) throw err;

    console.log('Username saved successfully!');
  });
})
app.get('/mon_all', function(req, res, next){
  Account.find({}, function(err,accounts){
    if(err) throw err;

    res.send(accounts);
  })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
