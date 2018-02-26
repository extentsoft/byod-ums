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
    var request = new Request("update [AgileControllerDB].[dbo].[UMS_Config] set [c_value]='"+req.param('starttime')+"',[modifierId] = '"+req.param('accname')+"',[updated_at] = current_timestamp where [c_name] = 'accesstimefrom';update [AgileControllerDB].[dbo].[UMS_Config] set [c_value]='"+req.param('endtime')+"',[modifierId] = '"+req.param('accname')+"',[updated_at] = current_timestamp where [c_name] = 'accesstimeto';update [AgileControllerDB].[dbo].[UMS_Config] set [c_value]='"+req.param('timediffsite')+"',[modifierId] = '"+req.param('accname')+"',[updated_at] = current_timestamp where [c_name] = 'accessdiffsite';update [AgileControllerDB].[dbo].[UMS_Config] set [c_value]='"+req.param('counteditdevice')+"',[modifierId] = '"+req.param('accname')+"',[updated_at] = current_timestamp where [c_name] = 'editdevice';update [AgileControllerDB].[dbo].[UMS_Config] set [c_value]='"+req.param('counteditprofile')+"',[modifierId] = '"+req.param('accname')+"',[updated_at] = current_timestamp where [c_name] = 'editprofile';update [AgileControllerDB].[dbo].[UMS_Config] set [c_value]='"+req.param('timelogin')+"',[modifierId] = '"+req.param('accname')+"',[updated_at] = current_timestamp where [c_name] = 'timelogin';update [AgileControllerDB].[dbo].[UMS_Config] set [c_value]='"+req.param('countlogin')+"',[modifierId] = '"+req.param('accname')+"',[updated_at] = current_timestamp where [c_name] = 'countlogin';", function(err, rowCount){

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


