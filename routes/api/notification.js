var express = require('express');
var pool = require('../../modules/mssql').pool;
var Request = require('tedious').Request;
var router = express.Router();


router.get('/:id', notificationList, function(req, res, next) {
    res.send(req.test2);

});

router.post('/:id', function(req, res, next) {
    res.send(req.params.id);
});


/*
app.param('id', function(req, res, next, id) {
    console.log('CALLED ONLY ONCE');
    next();
});

app.get('/user/:id', function(req, res, next) {
    console.log('although this matches');
    next();
});

app.get('/user/:id', function(req, res) {
    console.log('and this matches too');
    res.end();
});
*/

function notificationList(req, res, next) {
    console.log('notificationList middleware');

    req.test1 = "test test test";
    var result = [];

    pool.acquire(function(err, connection) {
        if (err) {
            console.error(err);
            return;
        }

        console.log('Connection successful');
        var queryStmt = "select top(5) * from [AgileControllerDB].[dbo].[UMS_Message] where ID = '" + req.params.id + "';";
        var request = new Request(queryStmt, function(err, rowCount) {

            //    var request = new Request("SELECT '"+req.param('name')+"'", function(err, rowCount){
            if (err) {
                console.error(err);
                return;
            }
            console.log('rowCount: ' + rowCount);
            //console.log(JSON.stringify(result));
            req.test2 = result;
            connection.release();
            next();
        });

        request.on('row', function(columns) {

            columns.forEach(function(column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    result.push(column.value);
                    res
                }
            });
        });
        connection.execSql(request);
    });
}


module.exports = router;