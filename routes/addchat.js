var express = require('express');
var pool = require('../modules/mssql').pool;
var Request = require('tedious').Request;
var router = express.Router();

var deviceList = function(req, res, next) {

    console.log('add chat ');
	console.log('msgchat');

    req.test1 = "test test test";

    var result = [];
    pool.acquire(function(err, connection) {
        if (err) {
            console.error(err);connection.release();
            return;
        }
        console.log('Connection successful');
        //console.log(rdata);
        var request = new Request("INSERT INTO [AgileControllerDB].[dbo].[UMS_Chat] ([name],[msg],[rdata],[created_at])  VALUES ('" + req.param('usr') + "','" + req.param('msgchat') + "','" + req.param('rdata') + "',current_timestamp)", function(err, rowCount) {

            //    var request = new Request("SELECT '"+req.param('name')+"'", function(err, rowCount){

            if (err) {
                console.error(err);connection.release();
                return;
            }
            console.log('rowCount: ' + rowCount);
            //console.log(JSON.stringify(result));
            req.test2 = result;
            connection.release();
            next();
        });

        request.on('row', function(columns) {
            //result.push(columns);
            columns.forEach(function(column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    result.push(column.value);
                    //console.log(column.value);
                }
            });
        });
        connection.execSql(request);
    });


}

var deviceList2 = function(req, res, next) {

    console.log('deviceList middleware');
	

    req.test1 = "test test test";
	console.log('add chat ');
	console.log(req.body.msgchat);

    var result = [];
    pool.acquire(function(err, connection) {
        if (err) {
            console.error(err);connection.release();
            return;
        }
        console.log('Connection successful');
        //console.log(rdata);
        var request = new Request("INSERT INTO [AgileControllerDB].[dbo].[UMS_Chat] ([name],[msg],[rdata],[created_at])  VALUES ('" + req.body.usr + "',N'" + req.body.msgchat + "',N'" + req.body.rdata + "',current_timestamp)", function(err, rowCount) {

            //    var request = new Request("SELECT '"+req.param('name')+"'", function(err, rowCount){

            if (err) {
                console.error(err);connection.release();
                return;
            }
            console.log('rowCount: ' + rowCount);
            //console.log(JSON.stringify(result));
            req.test2 = result;
            connection.release();
            next();
        });

        request.on('row', function(columns) {
            //result.push(columns);
            columns.forEach(function(column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    result.push(column.value);
                    //console.log(column.value);
                }
            });
        });
        connection.execSql(request);
    });


}

router.post('/', deviceList2, function(req, res, next) {
    //console.log('middleware 1 ' + req.test2);
    //console.log('middleware 2 ' + JSON.stringify(req.test2));
    res.send(req.test2);
    //res.send('respond with a resource');
});

router.get('/', deviceList, function(req, res, next) {
    //console.log('middleware 1 ' + req.test2);
    //console.log('middleware 2 ' + JSON.stringify(req.test2));
    res.send(req.test2);
    //res.send('respond with a resource');
});



module.exports = router;