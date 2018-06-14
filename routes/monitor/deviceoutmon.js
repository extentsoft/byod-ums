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

    //var request = new Request('select * from [test].[dbo].t1', function(err, rowCount){
	var q = '"';
    var request = new Request("delete from [AgileControllerDB].[dbo].[UMS_DeviceMon] where mac not in (select mac from [AgileControllerDB].[dbo].[TSM_E_Endpoint] join [AgileControllerDB].[dbo].[TSM_E_Account] on [bindMac] like '%'+[mac]+'%');SELECT [id],[account],case when ([userName] is not null or [userName] != '') then [userName]  else  '' end,case when ([host_name] is not null or [host_name] != '') then [host_name]  else  '' end,[mac],[os_name],[update_time],[match_time] FROM [AgileControllerDB].[dbo].[TSM_E_Account] a  join [AgileControllerDB].[dbo].[TSM_E_Endpoint] on [bindMac] like '%'+[mac]+'%'  join [AgileControllerDB].[dbo].[TSM_E_Organization] b on a.[orgID] = b.[orgID] where mac not in (select mac from [AgileControllerDB].[dbo].[UMS_DeviceMon])", function(err, rowCount){

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


