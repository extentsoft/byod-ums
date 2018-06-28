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

    var request = new Request(" if ('"+req.param('uid')+"') in (select [UID]  FROM [AgileControllerDB].[dbo].[UMS_UserStaging]) BEGIN UPDATE [AgileControllerDB].[dbo].[UMS_UserStaging] SET [PERSON_NID] = '"+req.param('ssn')+"',[PERSON_TH_NAME] = N'"+req.param('fn')+"',[PERSON_TH_SURNAME] = N'"+req.param('ln')+"',[LINE_POSITION_NAME] = N'"+req.param('pos')+"',[WORK_DEPT_LEVEL] = N'"+req.param('lv')+"',[WORK_DEPT_NAME] = N'"+req.param('area')+"' WHERE [UID] = '"+req.param('uid')+"'; end else begin INSERT INTO [AgileControllerDB].[dbo].[UMS_UserStaging] ([UID],[PERSON_NID],[PERSON_TH_NAME],[PERSON_TH_SURNAME],[LINE_POSITION_NAME],[WORK_DEPT_LEVEL],[WORK_DEPT_NAME])VALUES('"+req.param('uid')+"','"+req.param('ssn')+"','"+req.param('fn')+"','"+req.param('ln')+"','"+req.param('pos')+"','"+req.param('lv')+"','"+req.param('area')+"'); end;", function(err, rowCount){

	//    var request = new Request("SELECT '"+req.param('name')+"'", function(err, rowCount){

      if(err){
        console.error(err);
        return;
      }
      console.log('rowCount: ' + rowCount);
      //console.log(JSON.stringify(result));
	  console.log('rewrite header');
	  req.session.user.ssn = req.param('ssn');
      req.session.user.firstname = req.param('fn');
	  req.session.user.lastname = req.param('ln');
	  req.session.user.position = req.param('pos');
	  req.session.user.level = req.param('lv');
	  req.session.user.area = req.param('area');

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


