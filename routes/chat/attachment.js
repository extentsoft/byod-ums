var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.json('fewfw');
});

router.post('/', function(req, res, next) {
    res.json(req.body.data);
});

module.exports = router;