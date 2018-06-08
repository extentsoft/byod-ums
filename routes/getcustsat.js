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
	q = '"';
    var request = new Request("SELECT * FROM [AgileControllerDB].[dbo].[UMS_Custsat] a join (SELECT form_id,code_ref,sum(CAST(ch1 AS int)) c1,sum(CAST(ch2 AS int)) c2,sum(CAST(ch3 AS int)) c3,sum(CAST(ch4 AS int)) c4,sum(CAST(ch5 AS int)) c5 FROM [AgileControllerDB].[dbo].[UMS_CustsatResult] group by form_id,code_ref) b on a.form_id = b.form_id and a.code_ref = b.code_ref where a.form_id = '"+req.param('formid')+"'", function(err, rowCount){

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
});

module.exports = router;


