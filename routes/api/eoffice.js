var express = require('express');
var request = require('request');
var pool = require('../../modules/mssql').pool;
var Request = require('tedious').Request;
var router = express.Router();


router.get('/', function(req, res, next) {
    res.json('eoffice');
});

router.get('/test', function(req, res) {

    request('http://byod.excise.go.th/api/eoffice/profile/thanakdorn_p', function(error, response, body) {
        console.log(error);
        console.log(body);
        if (!error && response.statusCode == 200) {
            if (!body) {
                res.send(body) // Print the google web page.
            } else {
                res.send('null data');
            }

        } else {
            res.send('fewfw');
        }
    })
});


router.get('/profile/:email', function(req, res, next) {
    var result = [];
	pool.acquire(function(err, connection){
    if(err){
      console.error(err);
      return;
    }
    //console.log('Connection successful');

    var request = new Request("SELECT ISNULL(UID,''),ISNULL(PERSON_NID,''),ISNULL(PERSON_TH_NAME,''),ISNULL(PERSON_TH_SURNAME,''),ISNULL(LINE_POSITION_NAME,''),ISNULL(WORK_DEPT_LEVEL,''),ISNULL(PERSON_TYPE_CODE,''),ISNULL(WORK_DEPT_NAME,''),ISNULL(AUTHORIZE,'') FROM [AgileControllerDB].[dbo].[UMS_UserStaging] where [UID]='"+req.params.email+"'" , function(err, rowCount){

	//    var request = new Request("SELECT '"+req.param('name')+"'", function(err, rowCount){

      if(err){
        console.error(err);
        return;
      }
      console.log('rowCount: ' + rowCount);
	  if(rowCount==0){
		  res.json({ ssn: '', fn: '', ln: '', email: req.params.email, position: '', level: '', area: '', authorized: '' });
	  }	  

      //console.log(JSON.stringify(result));
      connection.release();
    });
	//console.log('tong');
    request.on('row', function(columns){
      //result.push(columns);
	  
	  console.log(columns[0].value);
	  res.json({ ssn: columns[1].value, fn: columns[2].value, ln: columns[3].value, email: req.params.email, position: columns[4].value, level: columns[5].value, area: columns[7].value, authorized: columns[8].value });
	  
      /*columns.forEach(function(column){
        if(column.value === null) {
          console.log('NULL');
        }
        else{			
			console.log(column.value);
        }
      });*/
    });
    connection.execSql(request);
  });
});

router.put('/profile/:ssn/:token', function(req, res, next) {
    console.log(req.body);
    //res.status(200).json({ message: 'Update Successfully' });
    res.status(403).json({ message: 'Unauthorized request' });
});


module.exports = router;