var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.json('eoffice');
});

router.get('/profile/:email', function(req, res, next) {
    if (req.params.email === 'natthawat_a') {
        res.json({ ssn: 'xxxxxxxxxxxxx', fn: 'Natthawat', ln: 'Arunweerungroj', email: 'natthawat_a@excise.go.th', position: '0', level: '0', area: '0' });
    } else if (req.params.email == 'thanakorn_p') {
        res.json({ ssn: 'xxxxxxxxxxxxx', fn: 'Thanakorn', ln: 'Piroonsith', email: 'thanakorn_p@excise.go.th', position: '0', level: '0', area: '0' });
    } else if (req.params.email == 'pinij') {
        res.json({ ssn: 'xxxxxxxxxxxxx', fn: 'Pinij', ln: 'Vitoonsaridsilp', email: 'pinij@excise.go.th', position: '500', level: '10', area: '1' });
    } else if (req.params.email == 'phanit') {
        res.json({ ssn: 'xxxxxxxxxxxxx', fn: 'Phanit', ln: 'Temjai', email: 'phanit@excise.go.th', position: '500', level: '10', area: '1' });
    } else if (req.params.email == 'usamas') {
        res.json({ ssn: 'xxxxxxxxxxxxx', fn: 'Usamas', ln: 'Ruamchai', email: 'usamas@excise.go.th', position: '500', level: '10', area: '1' });
    } else {
        res.json(null);
    }








});

module.exports = router;