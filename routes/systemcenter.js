var nodemailer = require('nodemailer');
var Crypt = require('../modules/crypt_sha');
var soap = require('soap');

var crypt = new Crypt();
module.exports = function(app, passport) {


    app.get('/systemcenter/api', function(req, res) {
        //var url = 'http://www.webservicex.net/length.asmx?wsdl';
        var url = 'http://192.168.42.166:8088/secoWS/service/NewAccountManagerServices?wsdl';

        //var args = { LengthValue: 5, fromLengthUnit: 'Nanometers', toLengthUnit: 'Millimeters' };
        var args = {
            in0: 'natthawat_a',
            in1: {
                account: 'natthawat_a',
                accountType: 1,
                orgName: '\\LDAP Users2',
                bindMac: '80-AA-96-94-AE-80,70-AA-96-94-AE-76',
                loginType: 7,
                userName: 'Natthawat Arunweerungroj'
            }
        };

        /*soap.createClient(url, function(err, client) {
            client.ChangeLengthUnit(args, function(err, result) {
                console.log(err);
            });
        });*/
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

    app.get('/systemcenter/test', function(req, res) {
        res.render("systemcenter/admin/test", {
            title: 'Test',
            email: req.user.email,
            firstname: req.user.firstname,
            lastname: req.user.lastname
        });
    });

    app.get('/systemcenter/', isLoggedIn, function(req, res) {
        console.log("Now you are logged in");
        console.log(req.user.email);
        res.redirect('/systemcenter/dashboard');
    });


    /* ================================================================
                              Admin Section
    =================================================================== */
    app.get('/systemcenter/dashboard', isLoggedIn, function(req, res) {
        //res.send("Hello System Center");
        console.log(' is admin ' + req.user.authorized);
        if (req.user.pref_theme == 0) {

            res.render('systemcenter/admin/dashboard', {
                title: 'แผงควบคุมหลัก',
                path: 'systemcenter/',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        } else {
            res.render('systemcenter/admin/dashboard_dark', {
                title: 'แผงควบคุมหลัก',
                path: 'systemcenter/',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        }


    });



    app.get('/systemcenter/configuration', isLoggedIn, function(req, res) {

        if (req.user.pref_theme == 0) {
            res.render('systemcenter/admin/configuration', {
                title: 'ปรับแต่ง',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        } else {
            res.render('systemcenter/admin/configuration_dark', {
                title: 'ปรับแต่ง',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        }



    });



    /* ================================================================
                              User Section
    =================================================================== */
    app.get('/systemcenter/device', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");

        if (req.user.pref_theme == 0) {
            res.render('systemcenter/device', {
                title: 'อุปกรณ์',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        } else {
            res.render('systemcenter/device_dark', {
                title: 'อุปกรณ์',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        }

    });

    app.get('/systemcenter/setting', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/setting");
        console.log('theme - ' + req.user.pref_theme);

        if (req.user.pref_theme == 0) {
            res.render('systemcenter/setting', {
                title: 'ตั้งค่า',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        } else {
            res.render('systemcenter/setting_dark', {
                title: 'ตั้งค่า',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        }

    });




    //////////////////// TZ /////////////////////////////////////

    //////////////////// TZ /////////////////////////////////////

    app.get('/systemcenter/profile', isLoggedIn, function(req, res) {
        //res.send("Hello System Center");
        if (req.user.pref_theme == 0) {
            res.render('systemcenter/profile', {
                title: 'ข้อมูลผู้ใช้งาน',
                //path: 'systemcenter/',
                message: req.flash('message'),
                ssn: req.user.ssn,
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                email: req.user.ssn,
                position: req.user.position,
                level: req.user.level,
                area: req.user.area,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        } else {
            res.render('systemcenter/profile_dark', {
                title: 'ข้อมูลผู้ใช้งาน',
                //path: 'systemcenter/',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                email: req.user.ssn,
                position: req.user.position,
                level: req.user.level,
                area: req.user.area,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        }

    });


    /* ================================================================
                            Report Section
    =================================================================== */
    app.get('/systemcenter/report/device/activate', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.user.pref_theme == 0) {
            res.render('systemcenter/report/device/activate', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        } else {
            res.render('systemcenter/report/device/activate_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        }
    });

    app.get('/systemcenter/report/device/deactivate/today', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.user.pref_theme == 0) {
            res.render('systemcenter/report/device/deactivate/today', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        } else {
            res.render('systemcenter/report/device/deactivate/today_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        }
    });

    app.get('/systemcenter/report/device/deactivate/week', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.user.pref_theme == 0) {
            res.render('systemcenter/report/device/deactivate/week', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        } else {
            res.render('systemcenter/report/device/deactivate/week_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        }
    });

    app.get('/systemcenter/report/device/deactivate/month', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.user.pref_theme == 0) {
            res.render('systemcenter/report/device/deactivate/month', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        } else {
            res.render('systemcenter/report/device/deactivate/month_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        }
    });

    app.get('/systemcenter/report/device/deactivate/year', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.user.pref_theme == 0) {
            res.render('systemcenter/report/device/deactivate/year', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        } else {
            res.render('systemcenter/report/device/deactivate/year_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        }
    });


    app.get('/systemcenter/report/usage/person/today', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/person/today', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        } else {
            res.render('systemcenter/report/usage/person/today_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        }
    });

    app.get('/systemcenter/report/usage/person/week', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/person/week', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        } else {
            res.render('systemcenter/report/usage/person/week_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        }
    });

    app.get('/systemcenter/report/usage/person/month', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/person/month', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        } else {
            res.render('systemcenter/report/usage/person/month_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        }
    });

    app.get('/systemcenter/report/usage/person/year', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/person/year', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        } else {
            res.render('systemcenter/report/usage/person/year_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        }
    });


    app.get('/systemcenter/report/usage/group/today', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/group/today', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        } else {
            res.render('systemcenter/report/usage/group/today_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        }
    });

    app.get('/systemcenter/report/usage/group/week', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/group/week', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        } else {
            res.render('systemcenter/report/usage/group/week_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        }

    });

    app.get('/systemcenter/report/usage/group/month', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/group/month', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        } else {
            res.render('systemcenter/report/usage/group/month_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        }
    });

    app.get('/systemcenter/report/usage/group/year', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.user.pref_theme == 0) {
            res.render('systemcenter/report/usage/group/year', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        } else {
            res.render('systemcenter/report/usage/group/year_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        }
    });

    app.get('/systemcenter/report/monitor/device/addmonitor', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.user.pref_theme == 0) {
            res.render('systemcenter/report/monitor/device/addmonitor', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        } else {
            res.render('systemcenter/report/monitor/device/addmonitor_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        }
    });

    app.get('/systemcenter/report/monitor/device/listmonitor', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.user.pref_theme == 0) {
            res.render('systemcenter/report/monitor/device/listmonitor', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        } else {
            res.render('systemcenter/report/monitor/device/listmonitor_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        }
    });

    app.get('/systemcenter/report/monitor/device/reportmonitor', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        if (req.user.pref_theme == 0) {
            res.render('systemcenter/report/monitor/device/reportmonitor', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        } else {
            res.render('systemcenter/report/monitor/device/reportmonitor_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        }
    });



    //////////////////// TZ /////////////////////////////////////


    app.get('/systemcenter/report/policy/usage', isLoggedIn, function(req, res) {
        if (req.user.pref_theme == 0) {
            res.render('systemcenter/report/policy/usage', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        } else {
            res.render('systemcenter/report/policy/usage_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        }
    });
    app.get('/systemcenter/report/policy/device', isLoggedIn, function(req, res) {
        if (req.user.pref_theme == 0) {
            res.render('systemcenter/report/policy/device', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        } else {
            res.render('systemcenter/report/policy/device_dark', {
                title: 'Report',
                message: req.flash('message'),
                email: req.user.email,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                isauthorized: req.user.authorized,
                privilege: req.user.pref_theme + ',' + req.user.pref_notification + ',' + req.user.authorized
            });
        }
    });





    //////////////////// TZ /////////////////////////////////////


    /* ================================================================
                              Others 
    =================================================================== */





    // Authentication
    app.get('/systemcenter/login', function(req, res) {
        res.render('systemcenter/login', { user: req.user, error: req.flash('error') });

        //res.render('profile/login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/systemcenter/login', passport.authenticate('local-login', {
        successRedirect: '/systemcenter', // redirect to the secure profile section
        failureRedirect: '/systemcenter/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    app.get('/systemcenter/logout', function(req, res) {
        req.logout();
        res.redirect('/systemcenter/login');
    });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    console.log('Authenticating');
    if (req.isAuthenticated())
        return next();

    res.redirect('/systemcenter/login');
}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}