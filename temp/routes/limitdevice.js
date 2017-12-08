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
    var request = new Request("if 'devicelimit"+req.param('limit')+"' in (select [parameterName] FROM [AgileControllerDB].[dbo].[TSM_E_TerminalParameter]) update [AgileControllerDB].[dbo].[TSM_R_TParameterAssign] set [parameterID] = (select [parameterID] FROM [AgileControllerDB].[dbo].[TSM_E_TerminalParameter] where [parameterName] = 'devicelimit"+req.param('limit')+"') where [itemID] =  (select [accountID] from [AgileControllerDB].[dbo].[TSM_E_Account] where [account] = '"+req.param('accname')+"'); else begin INSERT INTO [AgileControllerDB].[dbo].[TSM_E_TerminalParameter] ([parameterID],[parameterName],[typeID],[content]) VALUES ((select min([parameterID])-1 from [AgileControllerDB].[dbo].[TSM_E_TerminalParameter]),'devicelimit"+req.param('limit')+"','autoBindIpMac','<aut:AutoIpMacBind xmlns:aut="+q+"http://www.huaweisymantec.com/secospace/Component/schemas/autoipmacbindschema"+q+"><aut:parameter isAutoBind="+q+"true"+q+" userIp="+q+"false"+q+" userMac="+q+"true"+q+" terminalDiskSerial="+q+"false"+q+" equimentIp="+q+"false"+q+" equimentPort="+q+"false"+q+" vlan="+q+"false"+q+" filterUserIp="+q+q+" filterEquimentIp="+q+q+" maxNumberOfBind="+q+req.param('limit')+q+"/></aut:AutoIpMacBind>');update [AgileControllerDB].[dbo].[TSM_R_TParameterAssign] set [parameterID] = (select [parameterID] FROM [AgileControllerDB].[dbo].[TSM_E_TerminalParameter] where [parameterName] = 'devicelimit"+req.param('limit')+"') where [itemID] =  (select [accountID] from [AgileControllerDB].[dbo].[TSM_E_Account] where [account] = '"+req.param('accname')+"'); end;", function(err, rowCount){

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


