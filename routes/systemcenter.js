var nodemailer = require('nodemailer');
var Crypt = require('../modules/crypt_sha');
var soap = require('soap');

var crypt = new Crypt();
module.exports = function(app, passport) {

    app.get('/systemcenter/api', function(req, res) {
        //var url = 'http://www.webservicex.net/length.asmx?wsdl';
        var url = 'http://192.168.42.166:8088/OPMUI/service/AccountManagerServices?wsdl';

        //var args = { LengthValue: 5, fromLengthUnit: 'Nanometers', toLengthUnit: 'Millimeters' };
        var args = {
            in0: 'natthawat_a',
            in1: {
                account: 'natthawat_a',
                accountType: 1,
                orgName: '\LDAP Users2',
                bindMac: '80-AA-96-94-AE-80,70-AA-96-94-AE-70',
                loginType: 7,
                userName: 'Natthawat Arunweerungroj'
            }
        };

        /*soap.createClient(url, function(err, client) {
            client.ChangeLengthUnit(args, function(err, result) {
                console.log(result);
            });
        });*/
        soap.modifyAccount(url, function(err, client) {
            client.ChangeLengthUnit(args, function(err, result) {
                console.log(result);
            });
        });
    });

    app.get('/systemcenter/test', function(req, res) {
        res.render("systemcenter/admin/test", {
            title: 'Test'
        });
    });
	
	app.get('/systemcenter/', isLoggedIn, function(req, res) {
        console.log(req.user.email);
        res.render('systemcenter/admin/dashboard', {
            title: 'Dashboard'
        });
    });


    app.get('/systemcenter/dashboard', isLoggedIn, function(req, res) {
        //res.send("Hello System Center");
        res.render('systemcenter/admin/dashboard', {
            title: 'Dashboard',
            path: 'systemcenter/',
            message: req.flash('message'),
        });
    });

    app.get('/test', isLoggedIn, function(req, res) {
        //res.send("Hello System Center");
        res.render('systemcenter/admin/test', {
            title: 'Dashboard',
            path: 'systemcenter/',
            message: req.flash('message'),
        });
    });





    app.get('/device', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        res.render('systemcenter/device', {
            title: 'Device',
            message: req.flash('message'),
        });
    });

    app.get('/setting', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/setting");
        res.render('systemcenter/setting', {
            title: 'Setting',
            message: req.flash('message'),
        });
    });

    app.get('/systemcenter/configuration', isLoggedIn, function(req, res) {
        res.send("/systemcenter/configuration");
    });

    //////////////////// TZ /////////////////////////////////////

    //////////////////// TZ /////////////////////////////////////
    app.get('/systemcenter/profile', isLoggedIn, function(req, res) {
        //res.send("Hello System Center");
        res.render('systemcenter/admin/dashboard', {
            title: 'Dashboard',
            //path: 'systemcenter/',
            message: req.flash('message'),
        });
    });
    app.get('/configuration', isLoggedIn, function(req, res) {
        res.render('systemcenter/admin/dashboard', {
            title: 'Dashboard',
            //path: 'systemcenter/',
            message: req.flash('message'),
        });
    });
    app.get('/report/device/activate', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        res.render('systemcenter/report/device/activate', {
            title: 'Report',
            message: req.flash('message'),
        });
    });

    app.get('/report/device/deactivate/today', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        res.render('systemcenter/report/device/deactivate/today', {
            title: 'Report',
            message: req.flash('message'),
        });
    });

    app.get('/report/device/deactivate/week', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        res.render('systemcenter/report/device/deactivate/week', {
            title: 'Report',
            message: req.flash('message'),
        });
    });

    app.get('/report/device/deactivate/month', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        res.render('systemcenter/report/device/deactivate/month', {
            title: 'Report',
            message: req.flash('message'),
        });
    });

    app.get('/report/device/deactivate/year', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        res.render('systemcenter/report/device/deactivate/year', {
            title: 'Report',
            message: req.flash('message'),
        });
    });


    app.get('/report/usage/person/today', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        res.render('systemcenter/report/usage/person/today', {
            title: 'Report',
            message: req.flash('message'),
        });
    });

    app.get('/report/usage/person/week', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        res.render('systemcenter/report/usage/person/week', {
            title: 'Report',
            message: req.flash('message'),
        });
    });

    app.get('/report/usage/person/month', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        res.render('systemcenter/report/usage/person/month', {
            title: 'Report',
            message: req.flash('message'),
        });
    });

    app.get('/report/usage/person/year', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        res.render('systemcenter/report/usage/person/year', {
            title: 'Report',
            message: req.flash('message'),
        });
    });


    app.get('/report/usage/group/today', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        res.render('systemcenter/report/usage/group/today', {
            title: 'Report',
            message: req.flash('message'),
        });
    });

    app.get('/report/usage/group/week', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        res.render('systemcenter/report/usage/group/week', {
            title: 'Report',
            message: req.flash('message'),
        });
    });

    app.get('/report/usage/group/month', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        res.render('systemcenter/report/usage/group/month', {
            title: 'Report',
            message: req.flash('message'),
        });
    });

    app.get('/report/usage/group/year', isLoggedIn, function(req, res) {
        //res.send("/systemcenter/report/device/activate");
        res.render('systemcenter/report/usage/group/year', {
            title: 'Report',
            message: req.flash('message'),
        });
    });



    //////////////////// TZ /////////////////////////////////////


    app.get('/report/policy/usage', isLoggedIn, function(req, res) {
        res.render('systemcenter/report/policy/usage', {
            title: 'Report',
            message: req.flash('message'),
        });
    });
    app.get('/report/policy/device', isLoggedIn, function(req, res) {
        res.render('systemcenter/report/policy/device', {
            title: 'Report',
            message: req.flash('message'),
        });
    });



    //////////////////// TZ /////////////////////////////////////

    app.get('/systemcenter/report/device/deactivate', isLoggedIn, function(req, res) {
        res.send("/systemcenter/report/device/deactivate" + " today");
    });
    app.get('/systemcenter/report/device/deactivate/:period', isLoggedIn, function(req, res) {
        res.send("/systemcenter/report/device/deactivate" + " " + req.params.period);
    });
    app.get('/systemcenter/report/usage/group', isLoggedIn, function(req, res) {
        res.send("/systemcenter/report/usage/group" + " today");
    });
    app.get('/systemcenter/report/usage/group/:period', isLoggedIn, function(req, res) {
        res.send("/systemcenter/report/usage/group" + " " + req.params.period);
    });
    app.get('/systemcenter/report/usage/person', isLoggedIn, function(req, res) {
        res.send("/systemcenter/report/usage/person" + " today");
    });
    app.get('/systemcenter/report/usage/person/:period', isLoggedIn, function(req, res) {
        res.send("/systemcenter/report/usage/person" + " " + req.params.period);
    });
    app.get('/systemcenter/report/policy/usage', isLoggedIn, function(req, res) {
        res.send("/systemcenter/report/policy/usage");
    });
    app.get('/systemcenter/report/policy/device', isLoggedIn, function(req, res) {
        res.send("/systemcenter/report/policy/device");
    });



    
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