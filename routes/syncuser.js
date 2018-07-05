var express = require('express');
var pool = require('../modules/mssql').pool;
var Request = require('tedious').Request;
var router = express.Router();
var ipaddr = require('ipaddr.js');

var deviceList = function(req, res, next) {

    console.log('deviceList middleware');

    req.test1 = "test test test";

    var result = [];
    pool.acquire(function(err, connection) {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Connection successful');

        var request = new Request("DELETE FROM [AgileControllerDB].[dbo].[UMS_UserStaging] ;INSERT INTO [AgileControllerDB].[dbo].[UMS_UserStaging] ([UID],[PERSON_ID],[PERSON_NID],[PERSON_TYPE_CODE],[PERSON_TITLE],[PERSON_TH_NAME],[PERSON_TH_SURNAME],[UNDER_DEPT_CODE],[UNDER_DEPT_NAME],[WORK_DEPT_CODE],[WORK_DEPT_NAME],[WORK_DEPT_LEVEL],[LINE_POSITION_NAME],[POSITION_NO],[EXC_POS_NAME],[PERSON_STATUS_CODE],[LAST_SYNC]) SELECT [UID],[PERSON_ID],[PERSON_NID],[PERSON_TYPE_CODE],[PERSON_TITLE],[PERSON_TH_NAME],[PERSON_TH_SURNAME],[UNDER_DEPT_CODE],[UNDER_DEPT_NAME],[WORK_DEPT_CODE],[WORK_DEPT_NAME],[WORK_DEPT_LEVEL],[LINE_POSITION_NAME],[POSITION_NO],[EXC_POS_NAME],[PERSON_STATUS_CODE],CURRENT_TIMESTAMP FROM [AgileControllerDB].[dbo].[UMS_EOStaging]; UPDATE [AgileControllerDB].[dbo].[UMS_UserStaging] SET [PER_ENG_NAME] = b.[PER_ENG_NAME],[PER_ENG_SURNAME] = b.[PER_ENG_SURNAME] FROM [AgileControllerDB].[dbo].[UMS_DPStaging] AS b where  [PERSON_TH_NAME] = b.[PER_NAME] and [PERSON_TH_SURNAME] = b.[PER_SURNAME] ; INSERT INTO [AgileControllerDB].[dbo].[UMS_UserStaging] ([PERSON_TH_NAME], [PERSON_TH_SURNAME], [PER_ENG_NAME], [PER_ENG_SURNAME],[LAST_SYNC]) SELECT [PER_NAME], [PER_SURNAME], [PER_ENG_NAME], [PER_ENG_SURNAME],CURRENT_TIMESTAMP FROM [AgileControllerDB].[dbo].[UMS_DPStaging] a WHERE a.[PER_NAME] not in (SELECT [PERSON_TH_NAME] FROM [AgileControllerDB].[dbo].[UMS_UserStaging]) or a.[PER_SURNAME] not in (SELECT [PERSON_TH_SURNAME] from [AgileControllerDB].[dbo].[UMS_UserStaging]);", function(err, rowCount) {

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


router.get('/:user/:pw', deviceList, function(req, res, next) {
    //console.log('middleware 1 ' + req.test2);
    //console.log('middleware 2 ' + JSON.stringify(req.test2));
	console.log('ok');
	var clientInfo = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var ipString = req.connection.remoteAddress;
	var ip = '';
	ip = ipaddr.IPv6.parse(ipString);
	ip = ip.toIPv4Address().toString();
	
	console.log(ip);
	console.log(req.params.user);
	console.log(req.params.pw);
	if(ip.trim()== '127.0.0.1' && req.params.user.trim() == 'byod' && req.params.pw.trim() == 'password'){
		console.log('IP Valid');
		console.log('Authorized');
		res.send(req.test2);
		return;
	}
	else{
		console.log('IP Invalid');
		console.log('Unauthorized');
		res.send('Unauthorized');
		return;
	}
    
    //res.send('respond with a resource');
});

module.exports = router;