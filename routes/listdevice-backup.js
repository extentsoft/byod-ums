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
    var request = new Request("SELECT [id],[account] ,[userName],[orgName],[host_name],[mac],[os_name],[update_time],[match_time],CASE when t1.[accountID] in (select [itemID] from [AgileControllerDB].[dbo].[TSM_R_TParameterAssign]) then (SELECT CASE WHEN SUBSTRING([content],307,1) = '"+q+"' THEN SUBSTRING([content],306,1) ELSE SUBSTRING([content],306,2)END FROM [AgileControllerDB].[dbo].[TSM_E_Account] a join [AgileControllerDB].[dbo].[TSM_E_Organization] b on a.[orgID] = b.[orgID] join [AgileControllerDB].[dbo].[TSM_R_TParameterAssign] c on a.[accountID] = c.[itemID] join [AgileControllerDB].[dbo].[TSM_E_TerminalParameter] d on c.[parameterID] = d.[parameterID]where accountID = t1.[accountID]) else '3' END as limit FROM [AgileControllerDB].[dbo].[TSM_E_Account] t1  join [AgileControllerDB].[dbo].[TSM_E_Endpoint] on [account] = [login_account]  join [AgileControllerDB].[dbo].[TSM_E_Organization] t2 on t1.[orgID] = t2.[orgID] where [login_account] = '"+req.param('accname')+"'", function(err, rowCount){

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


