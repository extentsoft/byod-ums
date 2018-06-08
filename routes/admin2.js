module.exports = function(app, passport) {
    var nodemailer = require("nodemailer");

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    app.get('/api/message/email/:type/:user_ref', function(req, res) {
        var msg = '';
        var tpl_subject = '';
        if (req.params.type == 1) {
            tpl_subject = 'การเข้าออกระบบภายในระยะเวลาที่กำหนดมีจำนวนมากครั้งเกินไป';
            msg = 'ในขณะนี้ผู้ใช้งาน ' + req.params.user_ref + ' ได้ทำการเข้าออกระบบภายในระยะเวลาที่กำหนดมีจำนวนมากครั้งเกินไป';
        } else if (req.params.type == 2) {
            tpl_subject = 'มีการเข้าใช้งานสู่ระบบในระยะเวลาใกล้เคียงกันแต่อยู่ห่างกันคนละสถานที่';
            msg = 'ในขณะนี้ผู้ใช้งาน ' + req.params.user_ref + ' มีการเข้าใช้งานสู่ระบบในระยะเวลาใกล้เคียงกันแต่อยู่ห่างกันคนละสถานที่';
        } else if (req.params.type == 3) {
            tpl_subject = 'ทำการเข้า-ออกระบบนอกช่วงเวลาที่กำหนดไว้';
            msg = 'ในขณะนี้ผู้ใช้งาน ' + req.params.user_ref + ' ได้ทำการเข้า-ออกระบบนอกช่วงเวลาที่กำหนดไว้';
        } else if (req.params.type == 4) {
            tpl_subject = 'การเพิ่มหรือนำออกอุปกรณ์ออกจากระบบการลงทะเบียนบ่อยมากเกินไปต่อวัน';
            msg = 'ในขณะนี้ผู้ใช้งาน ' + req.params.user_ref + ' การเพิ่มหรือนำออกอุปกรณ์ออกจากระบบการลงทะเบียนบ่อยมากเกินไปต่อวัน';
        } else if (req.params.type == 5) {
            tpl_subject = 'มีการปรับปรุงข้อมูลส่วนตัวต่อวันจำนวนครั้งมากเกินไป';
            msg = 'ในขณะนี้ผู้ใช้งาน ' + req.params.user_ref + ' ได้ทำการปรับปรุงข้อมูลส่วนบุคคลบ่อยเกินกว่าที่่ระบบกำหนดไว้';
        } else if (req.params.type == 6) {
            tpl_subject = 'ทำการเข้า-ออกระบบโดยกำหนดอุปกรณ์';
            msg = 'ในขณะนี้ผู้ใช้งาน ' + req.params.user_ref + ' ทำการเข้า-ออกระบบโดยกำหนดอุปกรณ์';
        }

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
                console.log('ERROR');
                res.send('0');
				return;
            } else {
                console.log(info);
                console.log('Success');
                res.send('1');
				return;
            }
            //res.redirect('/profile/login');
        });

    });


    app.get('/sendCustSat/', function(req, res) {
        const mailOptions = {
            from: 'byod@excise.go.th', // sender address
            to: 'byod@excise.go.th', // list of receivers
            subject: 'Customer Satisfaction Survey', // Subject line
            html: 'To valued staffs,<br><br>Please complete survey link to improve our service in the future <br> <a href="http://byod.excise.go.th/custsat">Link</a><br><br>Thank you.<br><br>Administrator' // plain text body
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
                //pass: '7e4387ba355422'
                pass: 'byod1234'
            }
        });
        transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
                console.log(err)
                console.log('ERROR');
                res.send('0');
				return;
            } else {
                console.log(info);
                console.log('Success');
                res.send('1');
				return;
            }
            //res.redirect('/profile/login');
        });

    });
    app.get('/custsat/', function(req, res) {
        res.render('admin/custsat.ejs', { title: 'Customer Satisfaction Survey' });
    });


    

    app.get('/email/', function(req, res, next) {
        var smtp = {
            host: 'host.email.com', //set to your host name or ip
            port: 465, //25, 465, 587 depend on your
            secure: true, // use SSL
            auth: {
                user: 'user@email.com', //user account
                pass: 'password' //user password
            }
        };
        var smtpTransport = mailer.createTransport(smtp);

        var mail = {
            from: 'from@email.com', //from email (option)
            to: 'to@email.com', //to email (require)
            subject: "Subject Text", //subject
            html: `<p>Test</p>` //email body
        }

        smtpTransport.sendMail(mail, function(error, response) {
            smtpTransport.close();
            if (error) {
				return;
                //error handler
            } else {
                //success handler
                console.log('send email success');
				return;
            }
        });
    });


    app.get('/notify/:channel/:msg', function(req, res, next) {
        //insert into notification table
        var express = require('express');
        var pool = require('../modules/mssql').pool;
        var Request = require('tedious').Request;
        var router = express.Router();

        var deviceList = function(req, res, next) {

            //console.log('deviceList middleware');

            //req.test1 = "Insert";

            var result = [];
            pool.acquire(function(err, connection) {
                if (err) {
                    console.error(err);connection.release();
                    return;
                }
                console.log('Connection successful');

                var request = new Request("INSERT INTO [dbo].[UMS_Message] ([message] ,[receive_group],[created_at])  VALUES ('" + req.param('msg') + "','" + req.param('chanel') + "',current_timestamp)", function(err, rowCount) {

                    //    var request = new Request("SELECT '"+req.param('name')+"'", function(err, rowCount){

                    if (err) {
                        console.error(err);connection.release();
                        return;
                    }
                    console.log('rowCount: ' + rowCount);
                    //console.log(JSON.stringify(result));
                    req.test2 = result;
                    connection.release();
                    next();
                });

                request.on('row', function(columns) {
                    //result.push(columns);
                    columns.forEach(function(column) {
                        if (column.value === null) {
                            console.log('NULL');
                        } else {
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
        /*
  INSERT INTO [dbo].[UMS_Message]   ([message] ,[receive_group])  VALUES (param1,param2)
    */
        // UMS_Message(code varchar, message text, receive_group, created_at timestamp)

        //req.params.channel
        //req.params.msg
        if (true) res.send(1);
        else res.send(0);

        pool.acquire(function(err, connection) {
            if (err) {
                console.error(err);connection.release();
                return;
            }
            console.log('Connection successful');

            var request = new Request(" if ('" + req.param('termac') + "') in (select mac  FROM [AgileControllerDB].[dbo].[TSM_E_Endpoint]) UPDATE [AgileControllerDB].[dbo].[TSM_E_Endpoint] SET [host_name] = '" + req.param('tername') + "',[os_name] = '" + req.param('teros') + "',[login_account] = '" + req.param('teracc') + "' WHERE mac = '" + req.param('termac') + "'; else begin INSERT INTO [AgileControllerDB].[dbo].[TSM_E_Endpoint] ([ID],[mac],[os_name],[host_name],[device_type],[update_time],[match_time],[isIdentify],[isPermitUpdateGroup],[isRegister],[isLose],[isAssignPolicy],[isAssignGroup],[login_account])VALUES((select max(id) from [AgileControllerDB].[dbo].[TSM_E_Endpoint])+1,'" + req.param('termac') + "','" + req.param('teros') + "','" + req.param('tername') + "',2,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,1,1,0,0,0,0,'" + req.param('teracc') + "'); INSERT INTO [AgileControllerDB].[dbo].[TSM_R_EndpointGroupRelation]([endpoint_id],[group_id]) VALUES ((select max(id) from [AgileControllerDB].[dbo].[TSM_E_Endpoint]),2); end; INSERT INTO [AgileControllerDB].[dbo].[UMS_ActivityLog] ([detail],[userId],[devicemac],[created_at]) VALUES ('AddDevice','" + req.param('teracc') + "','" + req.param('termac') + "',CURRENT_TIMESTAMP);", function(err, rowCount) {

                //    var request = new Request("SELECT '"+req.param('name')+"'", function(err, rowCount){

                if (err) {
                    console.error(err);connection.release();
                    return;
                }
                console.log('rowCount: ' + rowCount);
                //console.log(JSON.stringify(result));
                req.test2 = result;
                connection.release();
                next();
            });

            request.on('row', function(columns) {
                //result.push(columns);
                columns.forEach(function(column) {
                    if (column.value === null) {
                        console.log('NULL');
                    } else {
                        result.push(column.value);
                        //console.log(column.value);
                    }
                });
            });
            connection.execSql(request);
        });
    });
};

// ==================

// ==================



// ==================

// ==================

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    console.log('Authenticating');
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}