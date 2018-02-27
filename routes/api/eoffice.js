var express = require('express');
var request = require('request');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.json('eoffice');
});

router.get('/test', function(req, res) {

    request('http://localhost/api/eoffice/profile/thanakdorn_p', function(error, response, body) {
        console.log(error);
        console.log(body);
        if (!error && response.statusCode == 200) {
            if (!body) {
                res.send(body) // Print the google web page.
            } else {
                res.send('null data');
            }

        } else {
            res.send('fewfw');
        }
    })
});


router.get('/profile/:email', function(req, res, next) {
    if (req.params.email === 'natthawat_a') {
        res.json({ ssn: 'xxxxxxxxxxxxx', fn: 'Natthawat', ln: 'Arunweerungroj', email: 'natthawat_a@excise.go.th', position: '0', level: '0', area: '0', authorized: true });
    } else if (req.params.email == 'byod1') {
        res.json({ ssn: 'xxxxxxxxxxxxx', fn: 'byod1', ln: 'sky', email: 'byod1@excise.go.th', position: '0', level: '0', area: '0', authorized: true });
    } else if (req.params.email == 'byod2') {
        res.json({ ssn: 'xxxxxxxxxxxxx', fn: 'byod2', ln: 'sky', email: 'byod2@excise.go.th', position: '0', level: '0', area: '0', authorized: true });
    } else if (req.params.email == 'byod3') {
        res.json({ ssn: 'xxxxxxxxxxxxx', fn: 'byod3', ln: 'sky', email: 'byod3@excise.go.th', position: '0', level: '0', area: '0', authorized: true });
    } else if (req.params.email == 'byod4') {
        res.json({ ssn: 'xxxxxxxxxxxxx', fn: 'byod4', ln: 'sky', email: 'byod4@excise.go.th', position: '0', level: '0', area: '0', authorized: true });
    } else if (req.params.email == 'pinij') {
        res.json({ ssn: 'xxxxxxxxxxxxx', fn: 'Pinij', ln: 'Vitoonsaridsilp', email: 'pinij@excise.go.th', position: '500', level: '10', area: '1', authorized: false });
    } else if (req.params.email == 'phanit') {
        res.json({ ssn: 'xxxxxxxxxxxxx', fn: 'Phanit', ln: 'Temjai', email: 'phanit@excise.go.th', position: '500', level: '10', area: '1', authorized: false });
    } else if (req.params.email == 'usamas') {
        res.json({ ssn: 'xxxxxxxxxxxxx', fn: 'Usamas', ln: 'Ruamchai', email: 'usamas@excise.go.th', position: '500', level: '10', area: '1', authorized: false });
    } else if (req.params.email == 'supornchai') {
        res.json({ ssn: 'xxxxxxxxxxxxx', fn: 'Supornchai', ln: 'Klinfoung', email: 'supornchai@excise.go.th', position: '500', level: '10', area: '1', authorized: false });
    } else if (req.params.email == 'maytee') {
        res.json({ ssn: 'xxxxxxxxxxxxx', fn: 'Maytee', ln: 'Thangsripong', email: 'maytee@excise.go.th', position: '500', level: '10', area: '1', authorized: false });
    } else {
        res.json(null);
    }
});

router.put('/profile/:ssn', function(req, res, next) {
    console.log('-- rewrite header --');
    console.log(req.body.fn);
    req.session.passport.user.firstname = req.body.fn;
    req.session.passport.user.lastname = req.body.ln;
    req.session.passport.user.position = req.body.position;
    req.session.passport.user.level = req.body.level;
    req.session.passport.user.area = req.body.area;

    req.session.save(function(err) {
        console.log(err);
        res.json({ status: 'success' });
    });



});


module.exports = router;