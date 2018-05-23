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
var listhistory = require('./routes/listhistory');
var checklimit = require('./routes/checklimit');

// List all user's bind MAC - TBL_ACCOUNT
// param = uid
var listmac = require('./routes/listmac');

// - TBL_ENDPOINT, TBL_ACCOUNT
var updatemac = require('./routes/updatemac');
var adddevice = require('./routes/adddevice');
var logdevice = require('./routes/logdevice');
var deletedevice = require('./routes/deletedevice');
var alldevices = require('./routes/alldevices');
var allusers = require('./routes/allusers');
var allnoti = require('./routes/allnoti');
var deletenoti = require('./routes/deletenoti');
var accesslog = require('./routes/accesslog');
var devicemonlog = require('./routes/devicemonlog');
var limitdevice = require('./routes/limitdevice');
var limitdevice_user = require('./routes/limitdevice_user');

var addprofilelog = require('./routes/addprofilelog');
var checkprofilelimit = require('./routes/checkprofilelimit');
var checkip = require('./routes/checkip');

var addcustsat = require('./routes/addcustsat');
var listcustsat = require('./routes/listcustsat');
var getcustsat = require('./routes/getcustsat');
var docustsat = require('./routes/docustsat');
var clearcustsat = require('./routes/clearcustsat');
var submitcustsat = require('./routes/submitcustsat');


var addnotimsg = require('./routes/addnotimsg');
var getnotimsg = require('./routes/getnotimsg');
var getnotimsgdetail = require('./routes/getnotimsgdetail');
var checknotimsg = require('./routes/checknotimsg');
var readnotimsg = require('./routes/readnotimsg');

var api_notification = require('./routes/api/notification');
var api_pdf = require('./routes/api/pdf');

var countlogin = require('./routes/countlogin');
var addchat = require('./routes/addchat');
var getchat = require('./routes/getchat');
var getconfig = require('./routes/getconfig');
var getconfig2 = require('./routes/getconfig2');
var editconfig = require('./routes/editconfig');
var editprofile = require('./routes/editprofile');
var getuserpref = require('./routes/getuserpref');
var edituserpref = require('./routes/edituserpref');
var addviolation = require('./routes/addviolation');
var getgroupname = require('./routes/getgroupname');
var getgroupname_dms = require('./routes/getgroupname_dms');
var getviolation = require('./routes/getviolation');
var getsite = require('./routes/getsite');
var getcontroller = require('./routes/getcontroller');
var gettype = require('./routes/gettype');
var getos = require('./routes/getos');
var getbrowser = require('./routes/getbrowser');


var deviceinmon = require('./routes/monitor/deviceinmon');
var deviceoutmon = require('./routes/monitor/deviceoutmon');
var adddevicemon = require('./routes/monitor/adddevicemon');
var removedevicemon = require('./routes/monitor/removedevicemon');

var traffic = require('./routes/reports/traffic');
var report671 = require('./routes/reports/report671');
var report678 = require('./routes/reports/report678');
var report6782 = require('./routes/reports/report6782');
var report67152 = require('./routes/reports/report67152');
var report671522 = require('./routes/reports/report671522');
var report672 = require('./routes/reports/report672');
var report6722 = require('./routes/reports/report6722');
var report673 = require('./routes/reports/report673');
var report676 = require('./routes/reports/report676');
var report675 = require('./routes/reports/report675');
var report677 = require('./routes/reports/report677');
var report67141 = require('./routes/reports/report67141');
var report67143 = require('./routes/reports/report67143');
var report67151 = require('./routes/reports/report67151');
var report67153 = require('./routes/reports/report67153');
var report671532 = require('./routes/reports/report671532');
var report67154 = require('./routes/reports/report67154');
var report714 = require('./routes/reports/report714');
var report681 = require('./routes/reports/report681');
var report682 = require('./routes/reports/report682');
var report683 = require('./routes/reports/report683');
var report684 = require('./routes/reports/report684');
var report685 = require('./routes/reports/report685');
var report686 = require('./routes/reports/report686');
var report687 = require('./routes/reports/report687');
var report688 = require('./routes/reports/report688');
var report689 = require('./routes/reports/report689');
var report6810 = require('./routes/reports/report6810');
var report6811 = require('./routes/reports/report6811');
var report6812 = require('./routes/reports/report6812');
var report6813 = require('./routes/reports/report6813');
var report6814 = require('./routes/reports/report6814');
var report6815 = require('./routes/reports/report6815');
report679
var report679 = require('./routes/reports/report679');

var violation_report = require('./routes/reports/violation_report');
var alllimit = require('./routes/reports/alllimit');
var checkaccesstime = require('./routes/policy/checkaccesstime');
var checkdevicemon = require('./routes/policy/checkdevicemon');
var checkcountdevice = require('./routes/policy/checkcountdevice');
var checkdiffsite = require('./routes/policy/checkdiffsite');

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
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', profile);
//app.use('/profile',isLoggedIn, profile);
//app.use('/admin', admin);


require('./routes/admin2')(app, passport);

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
app.use('/api/listhistory', listhistory);
app.use('/api/checklimit', checklimit);
app.use('/api/listmac', listmac);
app.use('/api/updatemac', updatemac);
app.use('/api/adddevice', adddevice);
app.use('/api/logdevice', logdevice);
app.use('/api/deletedevice', deletedevice);
app.use('/api/alldevices', alldevices);
app.use('/api/allusers', allusers);
app.use('/api/allnoti', allnoti);
app.use('/api/deletenoti', deletenoti);
app.use('/api/accesslog', accesslog);
app.use('/api/devicemonlog', devicemonlog);
app.use('/api/limitdevice', limitdevice);
app.use('/api/limitdevice_user', limitdevice_user);

app.use('/api/addprofilelog', addprofilelog);
app.use('/api/checkprofilelimit', checkprofilelimit);
app.use('/api/checkip', checkip);

app.use('/api/addcustsat', addcustsat);
app.use('/api/listcustsat', listcustsat);
app.use('/api/getcustsat', getcustsat);
app.use('/api/docustsat', docustsat);
app.use('/api/clearcustsat', clearcustsat);
app.use('/api/submitcustsat', submitcustsat);

app.use('/api/addnotimsg', addnotimsg);
app.use('/api/getnotimsg', getnotimsg);
app.use('/api/getnotimsgdetail', getnotimsgdetail);
app.use('/api/checknotimsg', checknotimsg);
app.use('/api/readnotimsg', readnotimsg);

app.use('/api/v2/notification', api_notification);
app.use('/api/v1/pdf', api_pdf);


app.use('/api/addchat', addchat);
app.use('/api/getchat', getchat);
app.use('/api/countlogin', countlogin);

app.use('/api/deviceinmon', deviceinmon);
app.use('/api/deviceoutmon', deviceoutmon);
app.use('/api/adddevicemon', adddevicemon);
app.use('/api/removedevicemon', removedevicemon);
app.use('/api/getconfig', getconfig);
app.use('/api/v2/getconfig', getconfig2);

app.use('/api/editprofile', editprofile);
app.use('/api/editconfig', editconfig);
app.use('/api/getuserpref', getuserpref);
app.use('/api/edituserpref', edituserpref);
app.use('/api/addviolation', addviolation);
app.use('/api/getgroupname', getgroupname);
app.use('/api/getgroupname_dms', getgroupname_dms);
app.use('/api/getviolation', getviolation);
app.use('/api/getsite', getsite);
app.use('/api/getcontroller', getcontroller);
app.use('/api/gettype', gettype);
app.use('/api/getos', getos);
app.use('/api/getbrowser', getbrowser);

app.use('/api/chat/attachment', require('./routes/chat/attachment'));
app.use('/api/eoffice', require('./routes/api/eoffice'));
app.use('/api/ums', require('./routes/api/ums'));

app.use('/report/traffic', traffic);
app.use('/report/report678', report678);
app.use('/report/report6782', report6782);
app.use('/report/report67152', report67152);
app.use('/report/report671522', report671522);
app.use('/report/report671', report671);
app.use('/report/report672', report672);
app.use('/report/report6722', report6722);
app.use('/report/report673', report673);
app.use('/report/report676', report676);
app.use('/report/report675', report675);
app.use('/report/report677', report677);
app.use('/report/report67141', report67141);
app.use('/report/report67143', report67143);
app.use('/report/report67151', report67151);
app.use('/report/report67153', report67153);
app.use('/report/report671532', report671532);
app.use('/report/report67154', report67154);
app.use('/report/violation_report', violation_report);
app.use('/report/alllimit', alllimit);
app.use('/report/report714', report714);

app.use('/report/report681', report681);
app.use('/report/report682', report682);
app.use('/report/report683', report683);
app.use('/report/report684', report684);
app.use('/report/report685', report685);
app.use('/report/report686', report686);
app.use('/report/report687', report687);
app.use('/report/report688', report688);
app.use('/report/report689', report689);
app.use('/report/report6810', report6810);
app.use('/report/report6811', report6811);
app.use('/report/report6812', report6812);
app.use('/report/report6813', report6813);
app.use('/report/report6814', report6814);
app.use('/report/report6815', report6815);
app.use('/report/report679', report679);

app.use('/api/checkcountdevice', checkcountdevice);
app.use('/api/checkdevicemon', checkdevicemon);
app.use('/api/checkaccesstime', checkaccesstime);
app.use('/api/checkdiffsite', checkdiffsite);


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