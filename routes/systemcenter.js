var nodemailer = require('nodemailer');
var Crypt = require('../modules/crypt_sha');
var soap = require('soap');
var request = require('request');
var Account = require('../models/account');
var os = require('os');
var useragent = require('useragent');
useragent(true);
var envConfig = require('../config/environment');


var crypt = new Crypt();
module.exports = function(app, passport) {


    app.get('/systemcenter/api', function(req, res) {
        //var url = 'http://www.webservicex.net/length.asmx?wsdl';
        var url = 'http://192.168.163.25:8088/secoWS/service/NewAccountManagerServices?wsdl';

        //var args = { LengthValue: 5, fromLengthUnit: 'Nanometers', toLengthUnit: 'Millimeters' };
        var args = {
            in0: 'natthawat_a',
            //in0: req.param('accname'),
            in1: {
                account: 'natthawat_a',
                //account: req.param('accname'),
                accountType: 4,
                orgName: '\\LDAP Users Temp\\People',
                bindMac: '38-71-DE-5A-EE-43',
                //bindMac: req.param('macbind'),
                loginType: 3,
				useFlag: 1,
                userName: 'Natthawat Arunweerungroj'
				
                    //userName: req.param('uname')
            }
        };

        /*soap.createClient(url, function(err, client) {
            client.ChangeLengthUnit(args, function(err, result) {
                console.log(err);
            });
        });*/
        console.log(args);

        soap.createClient(url, function(err, client) {
            var options = {
                mustUnderstand: true,
                hasTimeStamp: false,

                passwordType: 'PasswordText'
            };
            var wsSecurity = new soap.WSSecurity('admin', 'P@ssw0rd123', options);
            client.setSecurity(wsSecurity);

            client.modifyAccount(args, function(err, result) {
                console.log(result);
            });


            //new SoapUIClient('admin', 'P@ssw0rd123', {mustUnderstand: true,hasTimeStamp: false,passwordType: 'PasswordText'}).modifyAccount({in0: 'info',in1: {account: 'info',accountType: 1,orgName: '\\LDAP Users Temp',bindMac: 'AA-BB-CC-DD-EE-FF',loginType: 3,userName: 'Information Center'}});

        });
    });

    app.get('/systemcenter/', function(req, res) {
        res.redirect('/systemcenter/dashboard');
    });


    /* ================================================================
                              Admin Section
    =================================================================== */
    app.get('/systemcenter/dashboard', isLoggedIn, isSupported, function(req, res) {
        console.log('1 - ' + JSON.stringify(req.session.user));

        if (!req.session.authorized) res.redirect('/systemcenter/profile');

        console.log(' Your browsing with ', req.session.user.browser, req.session.user.bversion);
        console.log(' is admin ' + req.session.authorized);

        if (req.session.user.pref_theme == 0) {

            res.render('systemcenter/admin/dashboard', {
                title: 'แผงควบคุมหลัก',
                path: 'systemcenter/',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/admin/dashboard_dark', {
                title: 'แผงควบคุมหลัก',
                path: 'systemcenter/',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }


    });



    app.get('/systemcenter/configuration', isLoggedIn, isSupported, function(req, res) {

        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/admin/configuration', {
                title: 'ปรับแต่ง',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/admin/configuration_dark', {
                title: 'ปรับแต่ง',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }



    });



    /* ================================================================
                              User Section
    =================================================================== */
    app.get('/systemcenter/device', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");

        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/device', {
                title: 'อุปกรณ์',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/device_dark', {
                title: 'อุปกรณ์',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }

    });

    app.get('/systemcenter/history', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");

        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/history', {
                title: 'ประวัติการเข้าใช้งานย้อนหลัง',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/history_dark', {
                title: 'ประวัติการเข้าใช้งานย้อนหลัง',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }

    });

    app.get('/systemcenter/setting', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/setting");
        console.log('theme - ' + req.session.user.pref_theme);

        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/setting', {
                title: 'ตั้งค่า',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/setting_dark', {
                title: 'ตั้งค่า',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }

    });




    //////////////////// TZ /////////////////////////////////////

    //////////////////// TZ /////////////////////////////////////

    app.get('/systemcenter/profile', isLoggedIn, isSupported, function(req, res) {

        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/profile', {
                title: 'ข้อมูลผู้ใช้งาน',
                //path: 'systemcenter/',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/profile_dark', {
                title: 'ข้อมูลผู้ใช้งาน',
                //path: 'systemcenter/',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }

    });


    /* ================================================================
                            Report Section
    =================================================================== */
    app.get('/systemcenter/report/device/activate', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/device/activate', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/device/activate_dark', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/systemcenter/report/device/deactivate/today', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/device/deactivate/today', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/device/deactivate/today_dark', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/systemcenter/report/device/deactivate/week', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/device/deactivate/week', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/device/deactivate/week_dark', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/systemcenter/report/device/deactivate/month', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/device/deactivate/month', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/device/deactivate/month_dark', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/systemcenter/report/device/deactivate/year', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/device/deactivate/year', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/device/deactivate/year_dark', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });


    app.get('/systemcenter/report/usage/person/today', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/person/today', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/person/today_dark', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/systemcenter/report/usage/person/week', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/person/week', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/person/week_dark', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/systemcenter/report/usage/person/month', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/person/month', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/person/month_dark', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/systemcenter/report/usage/person/year', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/person/year', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/person/year_dark', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });


    app.get('/systemcenter/report/usage/group/today', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/group/today', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/group/today_dark', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/systemcenter/report/usage/group/group', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/group/group', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/group/group_dark', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/systemcenter/report/usage/group/week', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/group/week', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/group/week_dark', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }

    });

    app.get('/systemcenter/report/usage/group/month', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/group/month', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/group/month_dark', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/systemcenter/report/usage/group/year', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/group/year', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/group/year_dark', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/systemcenter/report/usage/site/today', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/site/today', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/site/today_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/systemcenter/report/usage/site/traffic', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/site/traffic', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/site/traffic_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/systemcenter/report/usage/site/amount', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/site/amount', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/site/amount_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/systemcenter/report/usage/site/site', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/site/site', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/site/site_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/systemcenter/report/usage/site/area', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/site/area', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/site/area_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/systemcenter/report/usage/type', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/type', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/type_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/systemcenter/report/usage/browser', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/browser', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/browser_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/systemcenter/report/usage/site', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/site', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/site_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/systemcenter/report/usage/activity', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/activity', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/activity_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/systemcenter/report/usage/os', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/os', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/os_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/systemcenter/report/usage/device', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/device', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/device_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/systemcenter/report/usage/time', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/time', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/time_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/systemcenter/report/usage/other/user', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/other/user', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/other/user_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/systemcenter/report/usage/other/mac', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/other/mac', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/other/mac_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/systemcenter/report/monitor/device/addmonitor', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/monitor/device/addmonitor', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/monitor/device/addmonitor_dark', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/systemcenter/report/monitor/device/listmonitor', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/monitor/device/listmonitor', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/monitor/device/listmonitor_dark', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/systemcenter/report/monitor/device/reportmonitor', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/monitor/device/reportmonitor', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/monitor/device/reportmonitor_dark', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });



    //////////////////// TZ /////////////////////////////////////


    app.get('/systemcenter/report/policy/usage', isLoggedIn, isSupported, function(req, res) {
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/policy/usage', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/policy/usage_dark', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
    app.get('/systemcenter/report/policy/device', isLoggedIn, isSupported, function(req, res) {
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/policy/device', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/policy/device_dark', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/systemcenter/report/policy/violation', isLoggedIn, isSupported, function(req, res) {
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/policy/violation', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/policy/violation_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });





    //////////////////// TZ /////////////////////////////////////


    /* ================================================================
                              Others 
    =================================================================== */





    // Authentication
    app.get('/systemcenter/login', checkSupported, function(req, res) {
        console.log('logging in');
        console.log();
        console.log(req.session.user);

        res.render('systemcenter/login', {
            ipaddr: getLocalIPAddr(),
            browser_family: req.session.user.browser,
            browser_version: req.session.user.bversion,
            browser_support: req.session.user.bsupport,
            system_ie_version: req.session.system.ie,
            system_chrome_version: req.session.system.chrome,
            system_firefox_version: req.session.system.firefox,
            error: req.flash('error')
        });
    });


    app.post('/systemcenter/login', function(req, res) {
        console.log(req.body.username + " -- " + req.body.password);
        /*
                if (req.body.username == "byod1" && req.body.password == 'password') {
                    req.session.authenticated = true;
                    req.session.authorized = 1;
                    req.session.uid = 'byod1';
                } else if (req.body.username == "byod2" && req.body.password == 'password') {
                    req.session.authenticated = true;
                    req.session.authorized = 2;
                    req.session.uid = 'byod2';
                } else {
                    req.session.authenticated = false;
                    req.session.authorized = false;
                }
        */

        // LDAP Taking Place
        var opts = {
            uid: req.body.username,
            email: req.body.username,
            password: req.body.password
        }
        Account.test(opts, function(err, user) {
            console.log('@passport_local file');
            console.log(' passport check type - ' + typeof(err));
            console.log(' passport check type - ' + typeof(user));

            // if there are any errors, return the error
            if (err instanceof Error) {
                console.log('Authentication Failure');
                req.session.authenticated = false;
                req.session.authorized = false;
                res.redirect('/systemcenter/login');
            } else {
                console.log('Authentication Success');
                console.log(user.email);
                console.log(user.password);
                //var AC = require('../app/models/account');

                req.session.authenticated = true;
                req.session.authorized = true;
                req.session.user = {};
                //req.session.user._id = user._id;
                req.session.user.email = user.email;
                req.session.user.password = user.password;




                console.log('Identity is being authorizing against e-Office');
                request('http://localhost/api/eoffice/profile/' + user.email, function(error, response, body) {

                    if (!error && response.statusCode == 200) {
                        if (body != null) {
                            //Authorization Done
                            console.log('parsing body');
                            parsed_body = JSON.parse(body);
                            console.log(JSON.stringify(body));
                            console.log(JSON.parse(body));
                            console.log(body);

                            var agent = useragent.parse(req.headers['user-agent']);
                            req.session.user.browser = agent.family;
                            req.session.user.bversion = agent.major;

                            req.session.user.firstname = parsed_body.fn;
                            req.session.user.lastname = parsed_body.ln;
                            req.session.user.ssn = parsed_body.ssn;
                            req.session.user.position = parsed_body.position;
                            req.session.user.level = parsed_body.level;
                            req.session.user.area = parsed_body.area;
                            req.session.authorized = parsed_body.authorized;

                            request('http://localhost/api/getuserpref?accname=' + user.email, function(error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    if (body != null) {
                                        var parsed_body = JSON.parse(body);
                                        console.log("profiling --> " + parsed_body[0]);
                                        console.log("profiling --> " + parsed_body[1]);

                                        req.session.user.pref_theme = parsed_body[0];
                                        req.session.user.pref_notification = parsed_body[1];

                                        res.redirect('/systemcenter/dashboard');
                                    } else {
                                        console.log('Profiling Failure');
                                        req.session.authenticated = false;
                                        req.session.authorized = false;
                                        res.redirect('/systemcenter/login');
                                    }
                                } else {

                                    console.log('Profiling Failure');
                                    req.session.authenticated = false;
                                    req.session.authorized = false;
                                    res.redirect('/systemcenter/login');
                                }

                            });
                        } else {
                            //if ERRROR happens once authorizing 
                            console.log('Authorizing Failure');
                            req.session.authenticated = false;
                            req.session.authorized = false;
                            res.redirect('/systemcenter/login');
                        }

                    } else {
                        //if ERRROR happens once authorizing 
                        console.log('Authorizing Failure');
                        req.session.authenticated = false;
                        req.session.authorized = false;
                        res.redirect('/systemcenter/login');
                    }
                })


            }
        });
        // ======================


    });



    app.get('/systemcenter/logout', function(req, res) {
        delete req.session.authenticated;
        delete req.session.authorized;
        delete req.session.user;

        res.redirect('/systemcenter/login');
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    console.log('Check Session');
    console.log(req.session.authenticated);
    console.log(req.session.authorized);

    if (req.session.authenticated) next();
    else res.redirect('/systemcenter/login');

}

function checkSupported(req, res, next) {
    console.log('Check Browser Compatibility');

    var agent = useragent.parse(req.headers['user-agent']);

    if (!req.session.user) req.session.user = {};
    //if (!req.session.user.warning_message) req.session.user.warning_message = 'ุณกำลังเข้าใช้งานระบบบริหารจัดการทรัพยากร​ ICT ด้วย ';
    if (!req.session.user.browser) req.session.user.browser = agent.family;
    if (!req.session.user.bversion) req.session.user.bversion = agent.major;

    if (!req.session.system) req.session.system = {};
    if (!req.session.system.ie) req.session.system.ie = '';
    if (!req.session.system.chrome) req.session.system.chrome = '';
    if (!req.session.system.firefox) req.session.system.firefox = '';


    request('http://' + envConfig.service_address + '/api/getconfig', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body != null) {
                var data = JSON.parse(body);
                req.session.system.ie = data[15];
                req.session.system.chrome = data[17];
                req.session.system.firefox = data[19];


                if (req.session.user.browser.toLowerCase() == data[14].toLowerCase()) {
                    if (data[15] > req.session.user.bversion) {
                        req.session.user.bsupport = false;
                    } else {
                        req.session.user.bsupport = true;
                    }
                } else if (req.session.user.browser.toLowerCase() == data[16].toLowerCase()) {
                    if (data[17] > req.session.user.bversion) {
                        req.session.user.bsupport = false;
                    } else {
                        req.session.user.bsupport = true;
                    }
                } else if (req.session.user.browser.toLowerCase() == data[18].toLowerCase()) {
                    if (data[19] > req.session.user.bversion) {
                        req.session.user.bsupport = false;
                    } else {
                        req.session.user.bsupport = true;
                    }
                } else {
                    req.session.user.bsupport = false;
                }

                console.log(' Your browsing with ', req.session.user.browser, req.session.user.bversion, 'which is ', req.session.user.bsupport);


            } else {
                console.log('natthawat_a has just violated');
            }
        } else {
            console.log('natthawat_a has just violated');
        }
        next();
    });
}

function isSupported(req, res, next) {
    console.log('Check Browser Compatibility');

    var agent = useragent.parse(req.headers['user-agent']);

    if (!req.session.user) req.session.user = {};
    if (!req.session.user.browser) req.session.user.browser = agent.family;
    if (!req.session.user.bversion) req.session.user.bversion = agent.major;


    request('http://' + envConfig.service_address + '/api/getconfig', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body != null) {
                var data = JSON.parse(body);

                if (req.session.user.browser.toLowerCase() == data[14].toLowerCase()) {
                    if (data[15] > req.session.user.bversion) {
                        req.session.user.bsupport = false;
                    } else {
                        req.session.user.bsupport = true;
                    }
                } else if (req.session.user.browser.toLowerCase() == data[16].toLowerCase()) {
                    if (data[17] > req.session.user.bversion) {
                        req.session.user.bsupport = false;
                    } else {
                        req.session.user.bsupport = true;
                    }
                } else if (req.session.user.browser.toLowerCase() == data[18].toLowerCase()) {
                    if (data[19] > req.session.user.bversion) {
                        req.session.user.bsupport = false;
                    } else {
                        req.session.user.bsupport = true;
                    }
                } else {
                    req.session.user.bsupport = false;
                }

                console.log(' Your browsing with ', req.session.user.browser, req.session.user.bversion, 'which is ', req.session.user.bsupport);

                if (!req.session.user.bsupport) {
                    delete req.session.authenticated;
                    delete req.session.authorized;
                    delete req.session.user;

                    res.redirect('/systemcenter/login');
                }


            } else {
                console.log('Something wrong');
            }
        } else {
            console.log('Something wrong');
        }
        next();
    });

}


function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


function getLocalIPAddr() {
    var ipaddr = '';
    var ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach(function(iframe) {
        var alias = 0;
        ifaces[iframe].forEach(function(iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                return;
            }

            if (alias >= 1) {
                console.log(iframe + ":" + alias, iface.address);
            } else {
                console.log(iframe, iface.address);
                ipaddr = iface.address;
            }
            ++alias;
        });
    });
    return ipaddr;
}