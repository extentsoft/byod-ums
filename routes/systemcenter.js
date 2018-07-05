var nodemailer = require('nodemailer');
var Crypt = require('../modules/crypt_sha');
var soap = require('soap');
var ipaddr = require('ipaddr.js');
var request = require('request');
var Account = require('../models/account');
var os = require('os');
var useragent = require('useragent');
useragent(true);
var envConfig = require('../config/environment');


var crypt = new Crypt();
module.exports = function(app, passport) {

    app.get('/api/agile', function(req, res) {
		console.log('api-update');
        //var url = 'http://www.webservicex.net/length.asmx?wsdl';
        var url = 'http://192.168.163.25:8088/secoWS/service/NewAccountManagerServices?wsdl';

        //var args = { LengthValue: 5, fromLengthUnit: 'Nanometers', toLengthUnit: 'Millimeters' };
        var args = {
            //in0: 'natthawat_a',
            in0: req.param('accname'),
            in1: {
                //account: 'natthawat_a',
                account: req.param('accname'),
                accountType: 4,
                orgName: '\\Excise LDAP\\People',
                //bindMac: '38-71-DE-5A-EE-43',
                bindMac: req.param('macbind'),
                loginType: 3,
				useFlag: 1,
                //userName: 'Natthawat Arunweerungroj'
				userName: req.param('uname')
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
				console.log("Agile Result");
				console.log(req.param('macbind'));
                console.log(result);
				res.send('0');
            });


            //new SoapUIClient('admin', 'P@ssw0rd123', {mustUnderstand: true,hasTimeStamp: false,passwordType: 'PasswordText'}).modifyAccount({in0: 'info',in1: {account: 'info',accountType: 1,orgName: '\\LDAP Users Temp',bindMac: 'AA-BB-CC-DD-EE-FF',loginType: 3,userName: 'Information Center'}});

        });
		
    });

    app.get('/', function(req, res) {
        res.redirect('/dashboard');
    });


    /* ================================================================
                              Admin Section
    =================================================================== */
    app.get('/dashboard', isLoggedIn, isSupported, function(req, res) {
        console.log('1 - ' + JSON.stringify(req.session.user));

        if (!req.session.authorized) res.redirect('/profile');

        console.log(' Your browsing with ', req.session.user.browser, req.session.user.bversion);
        console.log(' is admin ' + req.session.authorized);

        if (req.session.user.pref_theme == 0) {

            res.render('systemcenter/admin/dashboard', {
                title: 'แผงควบคุมหลัก',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/admin/dashboard_dark', {
                title: 'แผงควบคุมหลัก',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }


    });



    app.get('/configuration', isLoggedIn, isSupported, function(req, res) {
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/admin/configuration', {
                title: 'ปรับแต่ง',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/admin/configuration_dark', {
                title: 'ปรับแต่ง',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }



    });
	
	app.get('/superadmin', isLoggedIn, isSupported, function(req, res) {
		if (!req.session.authorized) res.redirect('/profile');
		if (req.session.user.email != 'byod') res.redirect('/dashboard');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/admin/superadmin', {
                title: 'ปรับแต่ง',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/admin/superadmin_dark', {
                title: 'ปรับแต่ง',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

	app.get('/removeadmin', isLoggedIn, isSupported, function(req, res) {
		if (!req.session.authorized) res.redirect('/profile');
		if (req.session.user.email != 'byod') res.redirect('/dashboard');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/admin/removeadmin', {
                title: 'ปรับแต่ง',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/admin/removeadmin_dark', {
                title: 'ปรับแต่ง',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    /* ================================================================
                              User Section
    =================================================================== */
    app.get('/device', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");

        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/device', {
                title: 'อุปกรณ์',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/device_dark', {
                title: 'อุปกรณ์',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }

    });

    app.get('/history', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");

        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/history', {
                title: 'ประวัติการเข้าใช้งานย้อนหลัง',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/history_dark', {
                title: 'ประวัติการเข้าใช้งานย้อนหลัง',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }

    });

    app.get('/setting', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/setting");
        console.log('theme - ' + req.session.user.pref_theme);
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/setting', {
                title: 'ตั้งค่า',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/setting_dark', {
                title: 'ตั้งค่า',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }

    });
	
	app.get('/custsat/do', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/setting");
        console.log('theme - ' + req.session.user.pref_theme);
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/custsat/do', {
                title: 'ตั้งค่า',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/custsat/do_dark', {
                title: 'ตั้งค่า',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }

    });
	
	
	app.get('/custsat/form', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/setting");
        console.log('theme - ' + req.session.user.pref_theme);
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/custsat/form', {
                title: 'ตั้งค่า',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/custsat/form_dark', {
                title: 'ตั้งค่า',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }

    });

	app.get('/custsat/result', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/setting");
        console.log('theme - ' + req.session.user.pref_theme);
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/custsat/result', {
                title: 'ตั้งค่า',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/custsat/result_dark', {
                title: 'ตั้งค่า',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }

    });
	
	
	app.get('/notification', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/setting");
        console.log('theme - ' + req.session.user.pref_theme);
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/admin/notification', {
                title: 'ตั้งค่า',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/admin/notification_dark', {
                title: 'ตั้งค่า',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }

    });


    //////////////////// TZ /////////////////////////////////////

    //////////////////// TZ /////////////////////////////////////

    app.get('/profile', isLoggedIn, isSupported, function(req, res) {

        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/profile', {
                title: 'ข้อมูลผู้ใช้งาน',
                //path: 'systemcenter/',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
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
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
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
    app.get('/report/device/activate', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/device/activate', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
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
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/report/device/deactivate/today', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/device/deactivate/today', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
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
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/report/device/deactivate/week', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/device/deactivate/week', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
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
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/report/device/deactivate/month', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/device/deactivate/month', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
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
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/report/device/deactivate/year', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/device/deactivate/year', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
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
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });


    app.get('/report/usage/person/today', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/person/today', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
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
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/report/usage/person/week', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/person/week', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
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
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/report/usage/person/month', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/person/month', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
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
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/report/usage/person/year', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/person/year', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
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
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });


    app.get('/report/usage/group/today', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/group/today', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
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
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/report/usage/group/group', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/group/group', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
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
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/report/usage/group/week', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/group/week', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
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
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }

    });

    app.get('/report/usage/group/month', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/group/month', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
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
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/report/usage/group/year', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/group/year', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
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
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/report/usage/site/today', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/site/today', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/site/today_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/report/usage/site/traffic', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/site/traffic', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/site/traffic_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/report/usage/site/amount', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/site/amount', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/site/amount_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/report/usage/site/site', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/site/site', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/site/site_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/report/usage/site/area', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/site/area', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/site/area_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/report/usage/type', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/type', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/type_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/report/usage/browser', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/browser', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/browser_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/report/usage/site', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/site', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/site_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/report/usage/level', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/level', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/level_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/report/usage/activity', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/activity', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/activity_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/report/usage/os', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/os', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/os_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/report/usage/device', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/device', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/device_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/report/usage/time', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/time', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/time_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/report/usage/other/user', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/other/user', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/other/user_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/report/usage/other/mac', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/other/mac', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/other/mac_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/report/usage/other/devicemon', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/other/devicemon', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/other/devicemon_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/report/usage/other/activate', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/other/activate', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/other/activate_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/report/usage/other/deactivate', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/other/deactivate', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/other/deactivate_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/report/usage/other/edituser', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/other/edituser', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/other/edituser_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/report/usage/other/editgroup', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/other/editgroup', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/other/editgroup_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/report/usage/other/statios', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/other/statios', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/other/statios_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/report/usage/other/statandroid', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/other/statandroid', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/other/statandroid_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/report/usage/other/statlinux', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/other/statlinux', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/other/statlinux_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/report/usage/other/statwindows', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/other/statwindows', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/other/statwindows_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/report/usage/other/statunknownos', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/other/statunknownos', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/other/statunknownos_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/report/usage/other/statunknowntype', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/other/statunknowntype', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/other/statunknowntype_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/report/usage/other/statmobile', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/other/statmobile', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/other/statmobile_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
	
	app.get('/report/usage/other/statcomputer', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/other/statcomputer', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/usage/other/statcomputer_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/report/monitor/device/addmonitor', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/monitor/device/addmonitor', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
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
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/report/monitor/device/listmonitor', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/monitor/device/listmonitor', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
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
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/report/monitor/device/reportmonitor', isLoggedIn, isSupported, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/monitor/device/reportmonitor', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
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
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });



    //////////////////// TZ /////////////////////////////////////


    app.get('/report/policy/usage', isLoggedIn, isSupported, function(req, res) {
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/policy/usage', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
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
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });
    app.get('/report/policy/device', isLoggedIn, isSupported, function(req, res) {
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/policy/device', {
                title: 'Report',
                message: req.flash('message'),
                ssn: req.session.user.ssn,
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
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
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                position: req.session.user.position,
                level: req.session.user.level,
                area: req.session.user.area,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        }
    });

    app.get('/report/policy/violation', isLoggedIn, isSupported, function(req, res) {
		if (!req.session.authorized) res.redirect('/profile');
        if (req.session.user.pref_theme == 0) {
            res.render('systemcenter/report/policy/violation', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
                isauthorized: req.session.authorized,
                privilege: req.session.user.pref_theme + ',' + req.session.user.pref_notification + ',' + req.session.authorized
            });
        } else {
            res.render('systemcenter/report/policy/violation_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.session.user.email,
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,ipaddr: req.session.user.ipaddr,browser_family: req.session.user.browser,
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
    app.get('/login', checkSupported, function(req, res) {
        console.log('logging in');
        console.log();
        console.log(req.session.user);
        var clientInfo = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var clientAddr = clientInfo.substring(":");

		
		console.log('logging in');
        console.log();
        console.log(req.session.user);
        var clientInfo = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		
		var ipString = req.connection.remoteAddress;
		if (ipaddr.IPv4.isValid(ipString)) {
  // ipString is IPv4
		} else if (ipaddr.IPv6.isValid(ipString)) {
		  var ip = ipaddr.IPv6.parse(ipString);
		  if (ip.isIPv4MappedAddress()) {
			// ip.toIPv4Address().toString() is IPv4
			console.log(ip.toIPv4Address().toString());
		  } else {
			//console.log('6');
			// ipString is IPv6
		  }
		} else {
		  // ipString is invalid
		}
		//console.log(ipaddr.IPv4.parse(ipString));
        
        res.render('systemcenter/login', {
            //ipaddr: getLocalIPAddr(),
            remoteaddr: ip.toIPv4Address().toString(),
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
		
		var clientInfo = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var clientAddr = clientInfo.substring(":");

		
		console.log('logging in');
        console.log();
        console.log(req.session.user);
        var clientInfo = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		
		var ipString = req.connection.remoteAddress;
		if (ipaddr.IPv4.isValid(ipString)) {
  // ipString is IPv4
		} else if (ipaddr.IPv6.isValid(ipString)) {
		  var ip = ipaddr.IPv6.parse(ipString);
		  if (ip.isIPv4MappedAddress()) {
			// ip.toIPv4Address().toString() is IPv4
			console.log(ip.toIPv4Address().toString());
		  } else {
			//console.log('6');
			// ipString is IPv6
		  }
		} else {
		  // ipString is invalid
		}

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
                res.redirect('/login');
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
				req.session.user.firstname = user.firstname;
				req.session.user.lastname = user.lastname;
				req.session.user.ipaddr = ip.toIPv4Address().toString();

				
                console.log('Identity is being authorizing against e-Office');
                request('http://byod.excise.go.th/api/eoffice/profile/' + user.email, function(error, response, body) {

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
							if(req.session.user.email === 'byod' || parsed_body.authorized =='TRUE'){
								req.session.authorized = true;
							}
							else{
								req.session.authorized = false;
							}
							
                            

                            request('http://byod.excise.go.th/api/getuserpref?accname=' + user.email, function(error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    if (body != null) {
                                        var parsed_body = JSON.parse(body);
                                        console.log("profiling --> " + parsed_body[0]);
                                        console.log("profiling --> " + parsed_body[1]);
										console.log(parsed_body);
                                        req.session.user.pref_theme = parsed_body[0];
                                        req.session.user.pref_notification = parsed_body[1];
										request('http://byod.excise.go.th/api/accesslog?browser='+ req.session.user.browser + '&ip=' + req.session.user.ipaddr + '&status=Login' + '&accname=' + user.email, function(error, response, body) {
											if (!error && response.statusCode == 200) {
												console.log('Login Logged');
											}
											else{
												var parsed_err = JSON.parse(error);
												//console.log('fa');
												console.log(parsed_err);
												return;
											}
										});
										
										request('http://byod.excise.go.th/api/countlogin?accname='+ user.email, function(error, response, body) {
											if (!error && response.statusCode == 200) {
												if (body != null) {
													var parsed_res = JSON.parse(body);
													//console.log('here');
													console.log(parsed_res);
													if(parsed_res[0] == 0){
														//console.log('notcall');
													}
													else {
														//console.log('call');
														request('http://byod.excise.go.th/api/addviolation?violation=overlogin&accname='+ user.email, function(error, response, body) {
															if (!error && response.statusCode == 200) {
																//console.log('sc');
															}
															else{
																var parsed_err = JSON.parse(error);
																//console.log('fa');
																console.log(parsed_err);	
																return;
															}
														});
														
														request('http://byod.excise.go.th/api/message/email/1/'+ user.email, function(error, response, body) {
															if (!error && response.statusCode == 200) {
																//console.log('sc');
															}
															else{
																var parsed_err = JSON.parse(error);
																//console.log('fa');
																console.log(parsed_err);
																return;
															}
														});
													}
													
												}                                        
											}
										});
										if(req.session.authorized){
											res.redirect('/dashboard');
										}
                                        else{
											res.redirect('/profile');
										}
                                    } else {
                                        console.log('Profiling Failure');
                                        req.session.authenticated = false;
                                        req.session.authorized = false;
                                        res.redirect('/login');
										return;
                                    }
                                } else {

                                    console.log('Profiling Failure');
                                    req.session.authenticated = false;
                                    req.session.authorized = false;
                                    res.redirect('/login');
									return;
                                }

                            });
                        } else {
                            //if ERRROR happens once authorizing 
                            console.log('Authorizing Failure');
                            req.session.authenticated = false;
                            req.session.authorized = false;
                            res.redirect('/login');
							return;
                        }

                    } else {
                        //if ERRROR happens once authorizing 
                        console.log('Authorizing Failure');
                        req.session.authenticated = false;
                        req.session.authorized = false;
                        res.redirect('/login');
						return;
                    }
                })


            }
        });
        // ======================


    });



    app.get('/logout', function(req, res) {
        delete req.session.authenticated;
        delete req.session.authorized;
        delete req.session.user;

        res.redirect('/login');
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    console.log('Check Session');
    console.log(req.session.authenticated);
    console.log(req.session.authorized);

    if (req.session.authenticated) next();
    else res.redirect('/login');

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
                    req.session.user.bsupport = true;
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
	/*console.log('agent');
	console.log(agent.family);
	console.log(useragent.is(req.headers['user-agent']).chrome);
	console.log(useragent.is(req.headers['user-agent']).ie);
	console.log(useragent.is(req.headers['user-agent']).firefox);*/
	if(useragent.is(req.headers['user-agent']).chrome || useragent.is(req.headers['user-agent']).ie || useragent.is(req.headers['user-agent']).firefox){
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

                /*if (!req.session.user.bsupport) {
                    delete req.session.authenticated;
                    delete req.session.authorized;
                    delete req.session.user;

                    res.redirect('/login');
                }*/


            } else {
                console.log('Something wrong');
            }
        } else {
            console.log('Something wrong');
        }
        next();
    });
	}
	
	else{
		req.session.user.bsupport = true;
		next();
	}

    

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