var express = require('express');
var pool = require('../../modules/mssql').pool;
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

    var request = new Request("select accountName from (select count(*) count_,accountName from (select radiusServerIp,accountName from [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] where timestamp < CURRENT_TIMESTAMP and timestamp > DateADD(mi, cast('-'+(select c_value from [AgileControllerDB].[dbo].[UMS_Config] where c_name = 'accessdiffsite') as int), Current_TimeStamp) group by radiusServerIp,accountName) a group by accountName) b where count_ > 1", function(err, rowCount){

	//    var request = new Request("SELECT '"+req.param('name')+"'", function(err, rowCount){

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
  //res.send('respond with a resource');
});

module.exports = router;


