var express = require('express');
var pool = require('../modules/mssql').pool;
var Request = require('tedious').Request;
var router = express.Router();
var nodemailer = require("nodemailer");

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

    var request = new Request("INSERT INTO [AgileControllerDB].[dbo].[UMS_Message] ([code], [message] ,[receive_group],[created_at])  VALUES (N'"+req.param('header')+"',N'"+req.param('msg')+"','"+req.param('chanel')+"',current_timestamp)", function(err, rowCount){

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
	var msg = '';
	var tpl_subject = '';
	tpl_subject = 'การแจ้งเตือนจากระบบ - ' + req.param('header');
	msg = req.param('msg');

	const mailOptions = {
		from: 'byod@excise.go.th', // sender address
		to: 'all@excise.go.th', // list of receivers
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

}


router.get('/', deviceList, function(req, res, next) {
  //console.log('middleware 1 ' + req.test2);
  //console.log('middleware 2 ' + JSON.stringify(req.test2));
  res.send(req.test2);
  //res.send('respond with a resource');
});

module.exports = router;


