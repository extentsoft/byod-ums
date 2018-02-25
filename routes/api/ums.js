var express = require('express');
var request = require('request');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.json('eoffice');
});

// GET /api/ums/preference
router.get('/preference/:user_ref', function(req, res, next) {
    console.log('profiling for ' + req.params.user_ref);
    res.json({ pref_theme: 0, pref_notification: 1 });
});


module.exports = router;