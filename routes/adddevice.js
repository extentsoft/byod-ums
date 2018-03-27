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

    var request = new Request(" if ('"+req.param('termac')+"') in (select mac  FROM [AgileControllerDB].[dbo].[TSM_E_Endpoint]) BEGIN UPDATE [AgileControllerDB].[dbo].[TSM_E_Endpoint] SET [host_name] = '"+req.param('tername')+"',[os_name] = '"+req.param('teros')+"',[login_account] = '"+req.param('teracc')+"' WHERE mac = '"+req.param('termac')+"'; end else begin INSERT INTO [AgileControllerDB].[dbo].[TSM_E_Endpoint] ([ID],[mac],[os_name],[host_name],[device_type],[update_time],[match_time],[isIdentify],[isPermitUpdateGroup],[isRegister],[isLose],[isAssignPolicy],[isAssignGroup],[login_account])VALUES((select max(id) from [AgileControllerDB].[dbo].[TSM_E_Endpoint])+1,'"+req.param('termac')+"','"+req.param('teros')+"','"+req.param('tername')+"',2,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,1,1,0,0,0,0,'"+req.param('teracc')+"'); INSERT INTO [AgileControllerDB].[dbo].[TSM_R_EndpointGroupRelation]([endpoint_id],[group_id]) VALUES ((select max(id) from [AgileControllerDB].[dbo].[TSM_E_Endpoint]),2); end;", function(err, rowCount){

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


