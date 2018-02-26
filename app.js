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
var mailer = require("nodemailer");

require('./config/passport_local')(passport);

/*
var index = require('./routes/index');
var admin = require('./routes/admin');
var profile = require('./routes/profile');
*/
/*
app.get('/inspect/' , function(req,res,next){
  next(); //#1 log in different site
});
app.get('/inspect/' , function(req,res,next){
  next(); //#2
});
app.get('/inspect/' , function(req,res,next){
  next(); //#3
});
app.get('/inspect/' , function(req,res,next){
  res.send('done'); //#4
});*/

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

var addnotimsg = require('./routes/addnotimsg');
var getnotimsg = require('./routes/getnotimsg');

var countlogin = require('./routes/countlogin');
var addchat = require('./routes/addchat');
var getchat = require('./routes/getchat');
var getconfig = require('./routes/getconfig');
var editconfig = require('./routes/editconfig');

var deviceinmon = require('./routes/monitor/deviceinmon');
var deviceoutmon = require('./routes/monitor/deviceoutmon');
var adddevicemon = require('./routes/monitor/adddevicemon');
var removedevicemon = require('./routes/monitor/removedevicemon');

var traffic = require('./routes/reports/traffic');
var report671 = require('./routes/reports/report671');
var report678 = require('./routes/reports/report678');
var report67152 = require('./routes/reports/report67152');
var report672 = require('./routes/reports/report672');
var report673 = require('./routes/reports/report673');
var report676 = require('./routes/reports/report676');
var report675 = require('./routes/reports/report675');
var report677 = require('./routes/reports/report677');
var report67153 = require('./routes/reports/report67153');

var checkcountdevice = require('./routes/policy/checkcountdevice');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use(require('express-session')({
    secret: 'byodatexcise',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session({ secret: 'byodatexcise' }));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', profile);
//app.use('/profile',isLoggedIn, profile);
//app.use('/admin', admin);

require('./routes/profile2')(app, passport);
require('./routes/admin2')(app, passport);
require('./routes/frameprofile')(app);
require('./routes/systemcenter')(app, passport);


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




app.use('/api/listdevice', listdevice);
app.use('/api/listmac', listmac);
app.use('/api/updatemac', updatemac);
app.use('/api/adddevice', adddevice);
app.use('/api/deletedevice', deletedevice);
app.use('/api/alldevices', alldevices);
app.use('/api/allusers', allusers);
app.use('/api/accesslog', accesslog);
app.use('/api/limitdevice', limitdevice);

app.use('/api/addnotimsg', addnotimsg);
app.use('/api/getnotimsg', getnotimsg);
app.use('/api/addchat', addchat);
app.use('/api/getchat', getchat);
app.use('/api/countlogin', countlogin);

app.use('/api/deviceinmon', deviceinmon);
app.use('/api/deviceoutmon', deviceoutmon);
app.use('/api/adddevicemon', adddevicemon);
app.use('/api/removedevicemon', removedevicemon);
app.use('/api/getconfig', getconfig);
app.use('/api/editconfig', editconfig);


app.use('/api/chat/attachment', require('./routes/chat/attachment'));
app.use('/api/eoffice', require('./routes/api/eoffice'));
app.use('/api/ums', require('./routes/api/ums'));

app.use('/report/traffic', traffic);
app.use('/report/report678', report678);
app.use('/report/report67152', report67152);
app.use('/report/report671', report671);
app.use('/report/report672', report672);
app.use('/report/report673', report673);
app.use('/report/report676', report676);
app.use('/report/report675', report675);
app.use('/report/report677', report677);
app.use('/report/report67153', report67153);

app.use('/policy/checkcountdevice', checkcountdevice);


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

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
module.exports = app;