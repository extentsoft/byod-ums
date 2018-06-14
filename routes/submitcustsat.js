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
    var request = new Request("INSERT INTO [AgileControllerDB].[dbo].[UMS_CustsatResult]([form_id],[code_ref],[ch1],[ch2],[ch3],[ch4],[ch5],[text],[account],[created_at]) VALUES('"+req.param('formid')+"','"+req.param('coderef')+"','"+req.param('res1')+"','"+req.param('res2')+"','"+req.param('res3')+"','"+req.param('res4')+"','"+req.param('res5')+"','"+req.param('ctext')+"','"+req.param('acc_now')+"',current_timestamp)", function(err, rowCount){

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


