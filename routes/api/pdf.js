var express = require('express');
var pool = require('../../modules/mssql').pool;
var Request = require('tedious').Request;
var router = express.Router();

var PDFDocument = require('pdfkit');
var blobStream = require('blob-stream');
var request = require('request');
var doc = new PDFDocument();
//var stream = doc.pipe(blobStream())
const reportDictionary = {
    "2671": "SELECT a.[id] ,[userName] 'User' ,[detail] 'Event',[devicemac] MAC,[os_name] 'OS',[created_at] 'Date',[orgName] 'group' FROM [AgileControllerDB].[dbo].[UMS_ActivityLog] a join [AgileControllerDB].[dbo].[TSM_E_Endpoint] c on a.[devicemac] = c.[mac] join [AgileControllerDB].[dbo].[TSM_E_Account] b on a.userId = b.account join [AgileControllerDB].[dbo].[TSM_E_Organization] d on b.orgID = d.orgID where ?1",
    "268": "select * from aaaa where ooo = ?1 and ppp = ?2",
};

router.get('/:report/:cond1/:cond2/:cond3/:cond4/:cond5', function(req, res, next) {
    console.log(req.params.report);
    //console.log(reportDictionary[req.params.report]);
    console.log(reportDictionary[req.params.report].replace("?1", req.params.cond1));

    var result = [];

    pool.acquire(function(err, connection) {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Connection successful');

        var request = new Request(reportDictionary[req.params.report].replace("?1", req.params.cond1), function(err, rowCount) {

            if (err) {
                console.error(err);
                return;
            }
            console.log('rowCount: ' + rowCount);
            console.log(JSON.stringify(result));
            req.test2 = result;
            connection.release();
            res.setHeader('Content-disposition', 'attachment; filename=' + req.params.report + '.pdf');
            res.setHeader('Content-type', 'application/pdf');

            //doc.pipe(fs.createWriteStream('output2.pdf'));
            doc.font('public/fonts/THSarabunBold.ttf')
                .fontSize(14)
                .text('รายงาน xxxxxxxxxxxxxxxxxxxx', 50, 50)
                .text('ColumnA', 50, 100)
                .text('ColumnB', 170, 100)
                .text('ColumnC', 270, 100)
                .text('ColumnD', 370, 100)
                .text('ColumnE', 470, 100);
            doc.moveTo(50, 115)
                .lineTo(520, 115)
                .strokeOpacity(20)
                .strokeColor("grey")
                .stroke();
            doc.font('public/fonts/THSarabun.ttf')
                .fontSize(12)
                .text('คอลัมน์1', 50, 120)
                .text('คอลัมน์2', 170, 120)
                .text('คอลัมน์3', 270, 120)
                .text('คอลัมน์4', 370, 120)
                .text('คอลัมน์5', 470, 120);
            doc.font('public/fonts/THSarabun.ttf')
                .fontSize(12)
                .text('คอลัมน์1', 50, 140)
                .text('คอลัมน์2', 170, 140)
                .text('คอลัมน์3', 270, 140)
                .text('คอลัมน์4', 370, 140)
                .text('คอลัมน์5', 470, 140);
            doc.pipe(res);
            doc.end();
            test();
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

function test(req, res, next) { console.log('NULL'); }

module.exports = router;