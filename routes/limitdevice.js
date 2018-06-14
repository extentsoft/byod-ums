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
    var request = new Request("if '"+req.param('accname')+"' in (select [user_ref] FROM [AgileControllerDB].[dbo].[UMS_Limitdevice]) update [AgileControllerDB].[dbo].[UMS_Limitdevice] set [limitdevice] = '"+req.param('limit')+"' where [user_ref] =  '"+req.param('accname')+"' else	INSERT INTO [AgileControllerDB].[dbo].[UMS_Limitdevice] ([user_id],[user_ref],[limitdevice],[updated_at]) VALUES ((select [accountID] from [AgileControllerDB].[dbo].[TSM_E_Account] where [account] = '"+req.param('accname')+"'),'"+req.param('accname')+"','"+req.param('limit')+"',current_timestamp)", function(err, rowCount){

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


