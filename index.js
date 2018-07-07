
/**
 * Module dependencies.
 */

var app = require('./app');
var debug = require('debug')('byod-ums:server');
var request = require('request');
var http = require('http');

var express = require('express');
var pool = require('./modules/mssql').pool;
var pool2 = require('./modules/mssql').pool;
var Request = require('tedious').Request;
var router = express.Router();

var nodemailer = require("nodemailer");
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '80');
app.set('port', port);

/**
 * Set scheduling jobs
 */


 var schedule = require('node-schedule');

 /**************** check different site ****************/
 
 var diffsite = schedule.scheduleJob('*/60 * * * * *', function() {
	//console.error('t');
	var result = [];
	pool.acquire(function(err, connection){
    if(err){
      console.error(err);
      return;
    }
    //console.log('Connection successful');

    var request = new Request("select accountName from (select count(*) count_,accountName from (select radiusClientIp,accountName from [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] where [sessionID] != '' and timestamp < CURRENT_TIMESTAMP and timestamp > DateADD(mi, cast('-'+(select c_value from [AgileControllerDB].[dbo].[UMS_Config] where c_name = 'accessdiffsite') as int), CURRENT_TIMESTAMP) and accountName not in (SELECT userId FROM [AgileControllerDB].[dbo].[UMS_ViolationLog] where created_at < CURRENT_TIMESTAMP and detail = 'accessdiffsite' and created_at > DateADD(mi, cast('-'+(select c_value from [AgileControllerDB].[dbo].[UMS_Config] where c_name = 'accessdiffsite') as int), CURRENT_TIMESTAMP) ) group by radiusClientIp,accountName) a group by accountName) b where count_ > 1", function(err, rowCount){

	//    var request = new Request("SELECT '"+req.param('name')+"'", function(err, rowCount){

      if(err){
        console.error(err);
        return;
      }
      //console.log('rowCount: ' + rowCount);
      //console.log(JSON.stringify(result));
      connection.release();
    });

    request.on('row', function(columns){
      //result.push(columns);
      columns.forEach(function(column){
        if(column.value === null) {
          console.log('NULL');
        }
        else{			
			console.log(column.value);
			pool2.acquire(function(err, connection2){
				if(err){
				  console.error(err);
				  return;
				}
				
				var request2 = new Request("INSERT INTO [AgileControllerDB].[dbo].[UMS_ViolationLog] ([detail],[userId],[created_at]) VALUES ('accessdiffsite','"+column.value+"',CURRENT_TIMESTAMP)", function(err, rowCount2){		
					if(err){
						console.error(err);
						return;
					}
					connection2.release();
				});
				connection2.execSql(request2);
			});
			var msg = '';
			var tpl_subject = '';
			tpl_subject = 'มีการเข้าใช้งานสู่ระบบในระยะเวลาใกล้เคียงกันแต่อยู่ห่างกันคนละสถานที่';
			msg = 'ในขณะนี้ผู้ใช้งาน ' + column.value + ' มีการเข้าใช้งานสู่ระบบในระยะเวลาใกล้เคียงกันแต่อยู่ห่างกันคนละสถานที่';

			const mailOptions = {
				from: 'byod@excise.go.th', // sender address
				to: 'byod@excise.go.th', // list of receivers
				subject: tpl_subject, // Subject line
				html: msg
			};

			var transporter = nodemailer.createTransport({
				//host: 'smtp.mailtrap.io',
				host: '61.19.233.5',
				//port: 2525,
				port: 25,
				secure: false,
				auth: {
					//user: '59ad65f3b7fa3b',
					user: 'byod@excise.go.th',
					//pass: '7e4387ba355422',
					pass: 'P@ssw0rdsky'
				}
			});
			transporter.sendMail(mailOptions, function(err, info) {
				if (err) {
					console.log(err)
					console.log('ERROR1');
					return;
					//res.send('0');
				} else {
					console.log(info);
					console.log('Success');
					//res.send('1');
					return;
				}
			});
			console.log('different site');
        }
      });
    });
    connection.execSql(request);
  });
 });
 
 
 
/**************** check device monitoring ****************/
 
 var devicemon = schedule.scheduleJob('*/60 * * * * *', function() {
	//console.error('d');
	var result = [];
	pool.acquire(function(err, connection){
    if(err){
      console.error(err);
      return;
    }
    //console.log('Connection successful');

    var request = new Request("delete from [AgileControllerDB].[dbo].[UMS_DeviceMon] where mac not in (select mac from [AgileControllerDB].[dbo].[TSM_E_Endpoint] join [AgileControllerDB].[dbo].[TSM_E_Account] on [bindMac] like '%'+[mac]+'%');select userName,terminalMac,terminalIp,radiusClientIp,radiusServerIp,CONVERT (datetime2(0), [timestamp],120) from [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] join [AgileControllerDB].[dbo].[UMS_DeviceMon] on terminalMac = mac where [sessionID] != '' and  CONVERT (datetime2(0), [timestamp],120) > CONVERT (datetime2(0), case when last_login is null then created_at else last_login end,120)", function(err, rowCount){

	//    var request = new Request("SELECT '"+req.param('name')+"'", function(err, rowCount){

      if(err){
        console.error(err);
        return;
      }
      //console.log('rowCount: ' + rowCount);
      //console.log(JSON.stringify(result));
      connection.release();
    });

    request.on('row', function(columns){
      result.push(columns);
	  var data_ = [];
	  var count_ = 0;
      columns.forEach(function(column){
        if(column.value === null) {
          console.log('NULL');
        }
        else{
			//console.log(count_);			
			//console.log(column.value);
			var data_ = [];
			console.log(column.value);
			update_time = new Date(columns[5].value);
            date_str =  update_time.getUTCFullYear() + "-" + (update_time.getUTCMonth() + 1) + "-" + update_time.getUTCDate() +' ' + update_time.getUTCHours() + ":" + update_time.getMinutes() + ":" + update_time.getSeconds();
			data_.push(columns[0].value);
			data_.push(columns[1].value);
			data_.push(columns[2].value);
			data_.push(columns[3].value);
			data_.push(columns[4].value);
			data_.push(date_str);
			if(count_ < 5){
				count_++;
			}
			else{
				//update_time = new Date(data_[5]);
                //date_str =  update_time.getUTCFullYear() + "-" + (update_time.getUTCMonth() + 1) + "-" + update_time.getUTCDate() +' ' + update_time.getUTCHours() + ":" + update_time.getMinutes() + ":" + update_time.getSeconds();
				//console.log(UTCDate);
			
				pool2.acquire(function(err, connection2){
					if(err){
					  console.error(err);
					  return;
					}
					
					var request2 = new Request("INSERT INTO [AgileControllerDB].[dbo].[UMS_DeviceMonLog] ([userName],[terminalMac],[terminalIp],[radiusClientIp],[radiusServerIp],[timestamp]) VALUES ('"+data_[0]+"','"+data_[1]+"','"+data_[2]+"','"+data_[3]+"','"+data_[4]+"',CONVERT (datetime2(0),'"+data_[5]+"')); update [AgileControllerDB].[dbo].[UMS_DeviceMon] set last_login = CONVERT (datetime2(0),'"+data_[5]+"',120) where mac = '"+data_[1]+"'", function(err, rowCount2){		
						if(err){
							console.error(err);
							return;
						}
						connection2.release();
					});
					connection2.execSql(request2);
				});
				
				var msg = '';
				var tpl_subject = '';
				tpl_subject = 'มีการเข้าใช้งานสู่ระบบด้วยอุปกรณ์ที่ถูกกำหนดไว้';
				msg = 'ในขณะนี้ผู้ใช้งาน ' + data_[0] + ' มีการเข้าใช้งานสู่ระบบด้วยอุปกรณ์ที่ถูกกำหนดไว้';

				const mailOptions = {
					from: 'byod@excise.go.th', // sender address
					to: 'byod@excise.go.th', // list of receivers
					subject: tpl_subject, // Subject line
					html: msg
				};

				var transporter = nodemailer.createTransport({
					//host: 'smtp.mailtrap.io',
					host: '61.19.233.5',
					//port: 2525,
					port: 25,
					secure: false,
					auth: {
						//user: '59ad65f3b7fa3b',
						user: 'byod@excise.go.th',
						//pass: '7e4387ba355422',
						pass: 'P@ssw0rdsky'
					}
				});
				transporter.sendMail(mailOptions, function(err, info) {
					if (err) {
						console.log(err)
						console.log('ERROR2');
						//res.send('0');
					} else {
						console.log(info);
						console.log('Success');
						//res.send('1');
					}
				});
				console.log('device monitoring');	
			}
					
        }
      });
    });
    connection.execSql(request);
  });
 });
 
 /**************** check access time ****************/
 
 var accesstime = schedule.scheduleJob('*/60 * * * * *', function() {
	//console.error('t');
	var result = [];
	pool.acquire(function(err, connection){
    if(err){
      console.error(err);
      return;
    }
    //console.log('Connection successful');

    var request = new Request("select [accountName],CONVERT(datetime2(0), [timestamp],120) from [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] where CONVERT (date,[timestamp]) = CONVERT (date,CURRENT_TIMESTAMP) and (CONVERT (time,[timestamp]) between (select CONVERT (time,c_value ) from [AgileControllerDB].[dbo].[UMS_Config] where c_name = 'accesstimefrom') and (select CONVERT (time,c_value ) from [AgileControllerDB].[dbo].[UMS_Config] where c_name = 'accesstimeto')) and CONVERT(datetime2(0), [timestamp],120) >  (select CONVERT(datetime2(0), case when max(created_at) is null then '2000-01-01 00:00:00.000' else max(created_at) end,120) from [AgileControllerDB].[dbo].[UMS_ViolationLog] where [userId] = [accountName] and detail ='outoftime')   order by [timestamp]", function(err, rowCount){

	//    var request = new Request("SELECT '"+req.param('name')+"'", function(err, rowCount){

      if(err){
        console.error(err);
        return;
      }
      //console.log('rowCount: ' + rowCount);
      //console.log(JSON.stringify(result));
      connection.release();
    });

    request.on('row', function(columns){
      result.push(columns);
	  console.log(columns.length);	  
	  var count_ = 0;
      columns.forEach(function(column){
        if(column.value === null) {
          console.log('NULL');
        }
        else{
			var data_ = [];
			console.log(column.value);
			update_time = new Date(columns[1].value);
            date_str =  update_time.getUTCFullYear() + "-" + (update_time.getUTCMonth() + 1) + "-" + update_time.getUTCDate() +' ' + update_time.getUTCHours() + ":" + update_time.getMinutes() + ":" + update_time.getSeconds();
			data_.push(columns[0].value);
			data_.push(date_str);
			if(count_ < 1){
				count_++;
			}
			else{			
				pool2.acquire(function(err, connection2){
					if(err){
					  console.error(err);
					  return;
					}
					
					var request2 = new Request("INSERT INTO [AgileControllerDB].[dbo].[UMS_ViolationLog] ([detail],[userId],[created_at]) VALUES ('outoftime','"+data_[0]+"','"+data_[1]+"')", function(err, rowCount2){		
						if(err){
							console.error(err);
							return;
						}
						connection2.release();
					});
					connection2.execSql(request2);
				});
				var msg = '';
				var tpl_subject = '';
				tpl_subject = 'มีการเข้าใช้งานสู่ระบบในช่วงเวลาที่กำหนดให้ตรวจสอบ';
				msg = 'ในขณะนี้ผู้ใช้งาน ' + data_[0] + ' มีการเข้าใช้งานสู่ระบบในช่วงเวลาที่กำหนดให้ตรวจสอบ';

				const mailOptions = {
					from: 'byod@excise.go.th', // sender address
					to: 'byod@excise.go.th', // list of receivers
					subject: tpl_subject, // Subject line
					html: msg
				};

				var transporter = nodemailer.createTransport({
					//host: 'smtp.mailtrap.io',
					host: '61.19.233.5',
					//port: 2525,
					port: 25,
					secure: false,
					auth: {
						//user: '59ad65f3b7fa3b',
						user: 'byod@excise.go.th',
						//pass: '7e4387ba355422',
						pass: 'P@ssw0rdsky'
					}
				});
				transporter.sendMail(mailOptions, function(err, info) {
					if (err) {
						console.log(err)
						console.log('ERROR1');
						return;
						//res.send('0');
					} else {
						console.log(info);
						console.log('Success');
						//res.send('1');
						return;
					}
					return;
				});
				console.log('access in violation time');
			}				
			
			
        }
      });
    });
    connection.execSql(request);
  });
 });


/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
}