var express = require('express');
var pool = require('../../modules/mssql').pool;
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


    var request = new Request("SELECT userName Account,orgName 'Group',mac,timestamp 'Date',CASE WHEN b.[os_name] = 'Android' or b.[os_name] = 'iOS' THEN 'Mobile' WHEN b.[os_name] like 'Windows%' or b.[os_name] = 'Linux' or b.[os_name] = 'OSX' THEN 'Computer' ELSE 'Unknown' END as 'Type' FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] a join [AgileControllerDB].[dbo].[TSM_E_Endpoint] b on a.[terminalMac] = b.mac where sessionID != '' and CONVERT (date, a.timestamp) between '"+req.param('start')+"' and '"+req.param('end')+"' and CASE WHEN b.[os_name] = 'Android' or b.[os_name] = 'iOS' THEN 'Mobile' WHEN b.[os_name] like 'Windows%' or b.[os_name] = 'Linux' or b.[os_name] = 'OSX' THEN 'Computer' ELSE 'Unknown' END = '"+req.param('type')+"'", function(err, rowCount){

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


