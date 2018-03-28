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

    var request = new Request("SELECT b.[description] Area,a.userName Account,a.terminalMac MAC,os_name,timestamp 'Date' FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] a join [AgileControllerDB].[dbo].[UMS_Site] b on [radiusClientIp] = [ipaddr] join [AgileControllerDB].[dbo].[TSM_E_Endpoint] e on a.terminalMac = e.mac where CONVERT (date, a.timestamp) between '"+req.param('start')+"' and '"+req.param('end')+"' and b.[description] = '"+req.param('site')+"' and [sessionID] !=''", function(err, rowCount){

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


