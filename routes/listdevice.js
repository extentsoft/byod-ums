var express = require('express');
var pool = require('../modules/mssql').pool;
var Request = require('tedious').Request;
var router = express.Router();

var deviceList = function(req,res,next){

  console.log('deviceList middleware');

  req.test1 = "test test test";

  var result = [];
  pool.acquire(function(err, connection){
    if(err){
      console.error(err);
      return;
    }
    console.log('Connection successful');

    //var request = new Request('select * from [test].[dbo].t1', function(err, rowCount){
	var q = '"';
    var request = new Request("DECLARE @result NVARCHAR(MAX);SELECT @result = [bindMac] FROM [AgileControllerDB].[dbo].[TSM_E_Account] where account = '"+req.param('accname')+"';SELECT e.[id],[account] ,[userName],[orgName],[host_name],[mac],[os_name],[update_time],[match_time],[limitdevice] FROM [AgileControllerDB].[dbo].[TSM_E_Account] t1  join [AgileControllerDB].[dbo].[TSM_E_Endpoint] e on  @result like '%'+[mac]+'%'  join [AgileControllerDB].[dbo].[TSM_E_Organization] t2 on t1.[orgID] = t2.[orgID] join [AgileControllerDB].[dbo].[UMS_Limitdevice] on [account] = [user_ref] where [account] = '"+req.param('accname')+"'", function(err, rowCount){

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


