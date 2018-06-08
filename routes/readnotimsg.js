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
      console.error(err);connection.release();
      return;
    }
    console.log('Connection successful');

    var request = new Request("if '"+req.param('acc_now')+"' in (SELECT [account] FROM [AgileControllerDB].[dbo].[UMS_MessageRel]) BEGIN update [AgileControllerDB].[dbo].[UMS_MessageRel] set [timestamp] = CURRENT_TIMESTAMP where [account] = '"+req.param('acc_now')+"'; END else BEGIN INSERT INTO [AgileControllerDB].[dbo].[UMS_MessageRel]([account],[timestamp]) VALUES('"+req.param('acc_now')+"',CURRENT_TIMESTAMP); END", function(err, rowCount){

	//    var request = new Request("SELECT '"+req.param('name')+"'", function(err, rowCount){

      if(err){
        console.error(err);connection.release();
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


