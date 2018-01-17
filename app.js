
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var envConfig = require('./config/environment');

const winston = require('winston');
winston.level = envConfig.log_level;

//var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var bCrypt = require('bcrypt-nodejs');

require('./config/passport_local')(passport);

/*
var index = require('./routes/index');
var admin = require('./routes/admin');
var profile = require('./routes/profile');
*/

// List user's terminal - TBL_ENDPOINT
// param = uid
var listdevice = require('./routes/listdevice');

// List all user's bind MAC - TBL_ACCOUNT
// param = uid
var listmac = require('./routes/listmac');

// - TBL_ENDPOINT, TBL_ACCOUNT
var updatemac = require('./routes/updatemac');
var adddevice = require('./routes/adddevice');
var deletedevice = require('./routes/deletedevice');
var alldevices = require('./routes/alldevices');
var allusers = require('./routes/allusers');
var accesslog = require('./routes/accesslog');
var limitdevice = require('./routes/limitdevice');

var deviceinmon = require('./routes/monitor/deviceinmon');
var deviceoutmon = require('./routes/monitor/deviceoutmon');
var adddevicemon = require('./routes/monitor/adddevicemon');
var removedevicemon = require('./routes/monitor/removedevicemon');

var report678 = require('./routes/reports/report678');
var report67152 = require('./routes/reports/report67152');
var report672 = require('./routes/reports/report672');
var report675 = require('./routes/reports/report675');
var report677 = require('./routes/reports/report677');
var report67153 = require('./routes/reports/report67153');
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
  secret: 'byodatexcise',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session({secret: 'byodatexcise'}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', profile);
//app.use('/profile',isLoggedIn, profile);
//app.use('/admin', admin);

require('./routes/profile2')(app,passport);
require('./routes/admin2')(app,passport);
require('./routes/frameprofile')(app);

/*
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
*/

app.use('/listdevice', listdevice);
app.use('/listmac', listmac);
app.use('/updatemac', updatemac);
app.use('/adddevice', adddevice);
app.use('/deletedevice', deletedevice);
app.use('/alldevices', alldevices);
app.use('/allusers', allusers);
app.use('/accesslog', accesslog);
app.use('/limitdevice', limitdevice);

app.use('/deviceinmon', deviceinmon);
app.use('/deviceoutmon', deviceoutmon);
app.use('/adddevicemon', adddevicemon);
app.use('/removedevicemon', removedevicemon);

app.use('/reports/report678', report678);
app.use('/reports/report67152', report67152);
app.use('/reports/report672', report672);
app.use('/reports/report675', report675);
app.use('/reports/report677', report677);
app.use('/reports/report67153', report67153);


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
