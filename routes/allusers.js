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
    //var request = new Request('select * from [test].[dbo].t1', function(err, rowCount){
    var request = new Request("SELECT [accountID],[account],[userName],[orgName],CASE when t1.[accountID] in (select [user_id] from [AgileControllerDB].[dbo].[UMS_Limitdevice]) then (SELECT [limitdevice] FROM [AgileControllerDB].[dbo].[UMS_Limitdevice] where [user_id] = t1.[accountID]) else (SELECT [limitdevice] FROM [AgileControllerDB].[dbo].[UMS_Limitdevice] where [user_id] = '999999' )END as limit FROM [AgileControllerDB].[dbo].[TSM_E_Account] t1 join [AgileControllerDB].[dbo].[TSM_E_Organization] t2 on t1.[orgID] = t2.[orgID] where orgName != 'Guest'", function(err, rowCount){

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


