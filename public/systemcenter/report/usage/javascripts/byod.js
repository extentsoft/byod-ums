function addterminal(teracc,tername,termac,teros){
	alert('ss');
var express = require('node_modules/express');
alert('a');
var pool = require('../modules/mssql').pool;
alert('b');
var Request = require('tedious').Request;
alert('c');
var router = express.Router();
alert('d');
var deviceList = function(req,res,next){
	alert('1');
  console.log('deviceList middleware');

  req.test1 = "test test test";

  var result = [];
  pool.acquire(function(err, connection){
    if(err){
		alert('2');
      console.error(err);
      return;
    }
	alert('3');
    console.log('Connection successful');

    //var request = new Request('select * from [test].[dbo].t1', function(err, rowCount){
    var request = new Request("INSERT INTO [AgileControllerDB].[dbo].[TSM_E_Endpoint] ([id] ,[mac],[os_name],[host_name],[device_type],[update_time],[match_time],[isIdentify],[isPermitUpdateGroup],[isRegister],[isLose],[isAssignPolicy],[isAssignGroup],[login_account])VALUES((select max(id) from [AgileControllerDB].[dbo].[TSM_E_Endpoint])+1,'"+ter_mac+"','"+ter_os+"','"+ter_host+"',2,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,1,1,0,0,0,0,'"+user_acc+"')", function(err, rowCount){
alert('4');
      if(err){
		  alert('5');
        console.error(err);
        return;
      }
      //console.log('rowCount: ' + rowCount);
      //console.log(JSON.stringify(result));
	  alert('6');
      req.test2 = result;
      connection.release();
      next();
    });

    request.on('row', function(columns){
      //result.push(columns);
	  alert('7');
      columns.forEach(function(column){
        if(column.value === null) {
			alert('8');
          console.log('NULL');
        }
        else{
			alert('9');
          console.log(column.value);
        }
      });
    });
    connection.execSql(request);
  });


}

alert('e');
}
