var nodemailer = require('nodemailer');
var Crypt = require('../modules/crypt_sha');
var soap = require('soap');
var request = require('request');
var Account = require('../models/account');

var crypt = new Crypt();
module.exports = function(app, passport) {


    app.get('/systemcenter/api', function(req, res) {
        //var url = 'http://www.webservicex.net/length.asmx?wsdl';
        var url = 'http://192.168.163.25:8088/secoWS/service/NewAccountManagerServices?wsdl';

        //var args = { LengthValue: 5, fromLengthUnit: 'Nanometers', toLengthUnit: 'Millimeters' };
        var args = {
            in0: 'info',
            //in0: req.param('accname'),
            in1: {
                account: 'info',
                //account: req.param('accname'),
                accountType: 1,
                orgName: '\\LDAP Users Temp',
                bindMac: 'AA-BB-CC-DD-EE-FF',
                //bindMac: req.param('macbind'),
                loginType: 3,
                userName: 'Information Center'
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
        });
    });

    app.get('/systemcenter/', function(req, res) {
        res.redirect('/systemcenter/dashboard');
    });


    /* ================================================================
                              Admin Section
    =================================================================== */
    app.get('/systemcenter/dashboard', isLoggedIn, function(req, res) {
        console.log('1 - ' + JSON.stringify(req.session.user));

        if (!req.session.authorized) res.redirect('/systemcenter/profile');

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



    app.get('/systemcenter/configuration', isLoggedIn, function(req, res) {

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
    app.get('/systemcenter/device', isLoggedIn, function(req, res) {
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

    app.get('/systemcenter/history', isLoggedIn, function(req, res) {
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

    app.get('/systemcenter/setting', isLoggedIn, function(req, res) {
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

    app.get('/systemcenter/profile', isLoggedIn, function(req, res) {

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
    app.get('/systemcenter/report/device/activate', isLoggedIn, function(req, res) {
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

    app.get('/systemcenter/report/device/deactivate/today', isLoggedIn, function(req, res) {
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

    app.get('/systemcenter/report/device/deactivate/week', isLoggedIn, function(req, res) {
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

    app.get('/systemcenter/report/device/deactivate/month', isLoggedIn, function(req, res) {
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

    app.get('/systemcenter/report/device/deactivate/year', isLoggedIn, function(req, res) {
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


    app.get('/systemcenter/report/usage/person/today', isLoggedIn, function(req, res) {
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

    app.get('/systemcenter/report/usage/person/week', isLoggedIn, function(req, res) {
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

    app.get('/systemcenter/report/usage/person/month', isLoggedIn, function(req, res) {
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

    app.get('/systemcenter/report/usage/person/year', isLoggedIn, function(req, res) {
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


    app.get('/systemcenter/report/usage/group/today', isLoggedIn, function(req, res) {
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

    app.get('/systemcenter/report/usage/group/week', isLoggedIn, function(req, res) {
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

    app.get('/systemcenter/report/usage/group/month', isLoggedIn, function(req, res) {
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

    app.get('/systemcenter/report/usage/group/year', isLoggedIn, function(req, res) {
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

    app.get('/systemcenter/report/usage/site/today', isLoggedIn, function(req, res) {
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

    app.get('/systemcenter/report/usage/site/amount', isLoggedIn, function(req, res) {
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

    app.get('/systemcenter/report/usage/site/area', isLoggedIn, function(req, res) {
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

    app.get('/systemcenter/report/usage/type', isLoggedIn, function(req, res) {
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

    app.get('/systemcenter/report/usage/browser', isLoggedIn, function(req, res) {
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

    app.get('/systemcenter/report/usage/os', isLoggedIn, function(req, res) {
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

    app.get('/systemcenter/report/monitor/device/addmonitor', isLoggedIn, function(req, res) {
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

    app.get('/systemcenter/report/monitor/device/listmonitor', isLoggedIn, function(req, res) {
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

    app.get('/systemcenter/report/monitor/device/reportmonitor', isLoggedIn, function(req, res) {
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


    app.get('/systemcenter/report/policy/usage', isLoggedIn, function(req, res) {
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
    app.get('/systemcenter/report/policy/device', isLoggedIn, function(req, res) {
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

    app.get('/systemcenter/report/policy/violation', isLoggedIn, function(req, res) {
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
    app.get('/systemcenter/login', function(req, res) {
        console.log('logging in');
        res.render('systemcenter/login', { user: req.session.user, error: req.flash('error') });
        console.log('tong');
        //res.render('profile/login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    /*app.post('/systemcenter/login', passport.authenticate('local-login', {
        successRedirect: '/systemcenter', // redirect to the secure profile section
        failureRedirect: '/systemcenter/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
*/
    app.post('/systemcenter/login', function(req, res) {
        console.log('cz');
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
                request('http://192.168.163.29/api/eoffice/profile/' + user.email, function(error, response, body) {

                    if (!error && response.statusCode == 200) {
                        if (body != null) {
                            //Authorization Done
                            console.log('parsing body');
                            parsed_body = JSON.parse(body);
                            console.log(JSON.stringify(body));
                            console.log(JSON.parse(body));
                            console.log(body);

                            req.session.user.firstname = parsed_body.fn;
                            req.session.user.lastname = parsed_body.ln;
                            req.session.user.ssn = parsed_body.ssn;
                            req.session.user.position = parsed_body.position;
                            req.session.user.level = parsed_body.level;
                            req.session.user.area = parsed_body.area;
                            req.session.authorized = parsed_body.authorized;

                            request('http://192.168.163.29/api/getuserpref?accname=' + user.email, function(error, response, body) {
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

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}