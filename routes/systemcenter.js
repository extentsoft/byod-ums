var nodemailer = require('nodemailer');
var Crypt = require('../modules/crypt_sha');
var crypt = new Crypt();
module.exports = function(app, passport) {

    app.get('/systemcenter/login', function(req, res) {
        res.send("login");
    });
    app.get('/dashboard', function(req, res) {
        //res.send("Hello System Center");
        res.render('systemcenter/admin/dashboard', {
            title: 'Dashboard',
            path: 'systemcenter/',
            message: req.flash('message'),
        });
    });
    

    app.get('/systemcenter/profile', function(req, res) {
        res.send("/systemcenter/profile");
    });

    app.get('/device', function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		res.render('systemcenter/device', {
            title: 'Device',
            message: req.flash('message'),
        });
    });

    app.get('/systemcenter/setting', function(req, res) {
        res.send("/systemcenter/setting");
    });

    app.get('/systemcenter/configuration', function(req, res) {
        res.send("/systemcenter/configuration");
    });
//////////////////// TZ /////////////////////////////////////
    app.get('/report/device/activate', function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		res.render('systemcenter/report/device/activate', {
            title: 'Report',
            message: req.flash('message'),
        });
    });
	
	app.get('/report/device/deactivate/today', function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		res.render('systemcenter/report/device/deactivate/today', {
            title: 'Report',
            message: req.flash('message'),
        });
    });
	
	app.get('/report/device/deactivate/week', function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		res.render('systemcenter/report/device/deactivate/week', {
            title: 'Report',
            message: req.flash('message'),
        });
    });
	
	app.get('/report/device/deactivate/month', function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		res.render('systemcenter/report/device/deactivate/month', {
            title: 'Report',
            message: req.flash('message'),
        });
    });
	
	app.get('/report/device/deactivate/year', function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		res.render('systemcenter/report/device/deactivate/year', {
            title: 'Report',
            message: req.flash('message'),
        });
    });
	
	
	app.get('/report/usage/person/today', function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		res.render('systemcenter/report/usage/person/today', {
            title: 'Report',
            message: req.flash('message'),
        });
    });
	
	app.get('/report/usage/person/week', function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		res.render('systemcenter/report/usage/person/week', {
            title: 'Report',
            message: req.flash('message'),
        });
    });
	
	app.get('/report/usage/person/month', function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		res.render('systemcenter/report/usage/person/month', {
            title: 'Report',
            message: req.flash('message'),
        });
    });
	
	app.get('/report/usage/person/year', function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		res.render('systemcenter/report/usage/person/year', {
            title: 'Report',
            message: req.flash('message'),
        });
    });
	
	
	app.get('/report/usage/group/today', function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		res.render('systemcenter/report/usage/group/today', {
            title: 'Report',
            message: req.flash('message'),
        });
    });
	
	app.get('/report/usage/group/week', function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		res.render('systemcenter/report/usage/group/week', {
            title: 'Report',
            message: req.flash('message'),
        });
    });
	
	app.get('/report/usage/group/month', function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		res.render('systemcenter/report/usage/group/month', {
            title: 'Report',
            message: req.flash('message'),
        });
    });
	
	app.get('/report/usage/group/year', function(req, res) {
        //res.send("/systemcenter/report/device/activate");
		res.render('systemcenter/report/usage/group/year', {
            title: 'Report',
            message: req.flash('message'),
        });
    });
	
	
//////////////////// TZ /////////////////////////////////////
    app.get('/systemcenter/report/device/deactivate', function(req, res) {
        res.send("/systemcenter/report/device/deactivate" + " today");
    });
    app.get('/systemcenter/report/device/deactivate/:period', function(req, res) {
        res.send("/systemcenter/report/device/deactivate" + " " + req.params.period);
    });
    app.get('/systemcenter/report/usage/group', function(req, res) {
        res.send("/systemcenter/report/usage/group" + " today");
    });
    app.get('/systemcenter/report/usage/group/:period', function(req, res) {
        res.send("/systemcenter/report/usage/group" + " " + req.params.period);
    });
    app.get('/systemcenter/report/usage/person', function(req, res) {
        res.send("/systemcenter/report/usage/person" + " today");
    });
    app.get('/systemcenter/report/usage/person/:period', function(req, res) {
        res.send("/systemcenter/report/usage/person" + " " + req.params.period);
    });
    app.get('/systemcenter/report/policy/usage', function(req, res) {
        res.send("/systemcenter/report/policy/usage");
    });
    app.get('/systemcenter/report/policy/device', function(req, res) {
        res.send("/systemcenter/report/policy/device");
    });



    /*
    // Authentication
    app.get('/systemcenter/login', function(req, res) {
        res.render('profile/login', { user: req.user, error: req.flash('error') });

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
        res.redirect('/profile/login');
    });*/
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