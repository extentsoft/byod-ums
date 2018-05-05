var express = require('express');
var pool = require('../modules/mssql').pool;
var Request = require('tedious').Request;
var router = express.Router();

var deviceList = function(req, res, next) {

    var result = [];
    pool.acquire(function(err, connection) {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Connection successful');
        q = '"';
        //var request = new Request('select * from [test].[dbo].t1', function(err, rowCount){
			
		console.log('rewrite header');
        console.log(req.session.user.pref_theme);
        req.session.user.pref_theme = req.param('theme');
        console.log(req.session.user.pref_theme);

        req.session.user.pref_notification = req.param('noti');

        var request = new Request("if '" + req.param('accname') + "' in (select [user_ref] from [AgileControllerDB].[dbo].[UMS_UserPreference]) begin update [AgileControllerDB].[dbo].[UMS_UserPreference] set [notification]='" + req.param('noti') + "',[theme] = '" + req.param('theme') + "',updated_at=CURRENT_TIMESTAMP where user_ref='" + req.param('accname') + "'; end; else begin INSERT INTO [AgileControllerDB].[dbo].[UMS_UserPreference] ([user_ref],[notification],[theme],[updated_at]) VALUES ('" + req.param('accname') + "','" + req.param('noti') + "','" + req.param('theme') + "',CURRENT_TIMESTAMP); end;", function(err, rowCount) {

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


router.get('/', deviceList, function(req, res, next) {
    //console.log('middleware 1 ' + req.test2);
    //console.log('middleware 2 ' + JSON.stringify(req.test2));


    res.send(req.test2);
});

module.exports = router;