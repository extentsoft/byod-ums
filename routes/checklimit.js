var express = require('express');
var pool = require('../modules/mssql').pool;
var Request = require('tedious').Request;
var router = express.Router();

var deviceList = function(req,res,next){

  var result = [];
  pool.acquire(function(err, connection){
    if(err){
      console.error(err);
      return;
    }
    console.log('Connection successful');
	q = '"';
    var request = new Request("if '"+req.param('accname')+"' in (SELECT [account] FROM [AgileControllerDB].[dbo].[TSM_E_Account] t1 join [AgileControllerDB].[dbo].[TSM_E_Organization] t2 on t1.[orgID] = t2.[orgID] where orgName != 'Guest' and (select count(*) from [AgileControllerDB].[dbo].[TSM_E_Endpoint] where login_account = t1.account) = CASE when t1.[accountID] in (select [user_id] from [AgileControllerDB].[dbo].[UMS_Limitdevice]) then (SELECT [limitdevice] FROM [AgileControllerDB].[dbo].[UMS_Limitdevice] where [user_id] = t1.[accountID]) else (SELECT [limitdevice] FROM [AgileControllerDB].[dbo].[UMS_Limitdevice] where [user_id] = '999999' ) END ) select 1 else select 0", function(err, rowCount){

      if(err){
        console.error(err);
        return;
      }
      console.log('rowCount: ' + rowCount);
      //console.log(JSON.stringify(result));
      req.test2 = result;
      connection.release();
      next();
    });

    request.on('row', function(columns){
      //result.push(columns);
      columns.forEach(function(column){
        if(column.value === null) {
          console.log('NULL');
        }
        else{
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


