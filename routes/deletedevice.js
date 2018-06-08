var express = require('express');
var pool = require('../modules/mssql').pool;
var Request = require('tedious').Request;
var router = express.Router();

var deviceList = function(req,res,next){

  var result = [];
  pool.acquire(function(err, connection){
    if(err){
      console.error(err);connection.release();
      return;
    }
    console.log('Connection successful');

    var request = new Request("UPDATE [AgileControllerDB].[dbo].[TSM_E_Endpoint] SET [host_name] = '',[login_account] = '' WHERE mac = '"+req.param('termac')+"';INSERT INTO [AgileControllerDB].[dbo].[UMS_ActivityLog] ([detail],[userId],[devicemac],[created_at]) VALUES ('DeleteDevice','"+req.param('teracc')+"','"+req.param('termac')+"',CURRENT_TIMESTAMP)", function(err, rowCount){

	//    var request = new Request("SELECT '"+req.param('name')+"'", function(err, rowCount){

      if(err){
        console.error(err);connection.release();
        return;
      }

      req.resp = result;
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

  res.send(req.resp);

});

module.exports = router;


