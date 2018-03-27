var express = require('express');
var pool = require('../../modules/mssql').pool;
var Request = require('tedious').Request;
var router = express.Router();

var PDFDocument = require('pdfkit');
var blobStream = require('blob-stream');
//var request = require('request');
var doc = new PDFDocument();
//var stream = doc.pipe(blobStream())


const reportDictionary = {
    "2671": {
        stmt: "SELECT top 50 [userName] 'User', [devicemac] MAC,[os_name] 'OS',[created_at] 'Date',[orgName] 'group' FROM [AgileControllerDB].[dbo].[UMS_ActivityLog] a join [AgileControllerDB].[dbo].[TSM_E_Endpoint] c on a.[devicemac] = c.[mac] join [AgileControllerDB].[dbo].[TSM_E_Account] b on a.userId = b.account join [AgileControllerDB].[dbo].[TSM_E_Organization] d on b.orgID = d.orgID where detail = 'AddDevice'  and CONVERT (date, created_at) between '?1' and '?2' and [orgName] = '?3'",
        header: "เจ้าของอุปกรณ์,MAC,ระบบปฏิบัติการ,วันที่ลงทะเบียนอุปกรณ์,กลุ่มผู้ใช้งาน",
        title: "รายงาน xxxx",
        filename: "report"
    },
    "2672": {
        stmt: "SELECT top 20 [userName] 'User',[devicemac] MAC,[os_name] 'OS',[created_at] 'Date',[orgName] 'group' FROM [AgileControllerDB].[dbo].[UMS_ActivityLog] a join [AgileControllerDB].[dbo].[TSM_E_Endpoint] c on a.[devicemac] = c.[mac] join [AgileControllerDB].[dbo].[TSM_E_Account] b on a.userId = b.account join [AgileControllerDB].[dbo].[TSM_E_Organization] d on b.orgID = d.orgID where detail = 'AddDevice'  and CONVERT (date, created_at) between '?1' and '?2' and [orgName] = '?3'",
        header: "เจ้าของอุปกรณ์,MAC,ระบบปฏิบัติการ,วันที่ลงทะเบียนอุปกรณ์,กลุ่มผู้ใช้งาน",
        title: "รายงาน xxxx",
        filename: "report"
    },
};

//router.get('/:report/:cond1/:cond2/:cond3/:cond4/:cond5', prepareContent, function(req, res) {
router.get('/:report/:cond1/:cond2/:cond3/:cond4/:cond5', function(req, res) {
    console.log(req.params.report, req.params.cond1, req.params.cond2, req.params.cond3, req.params.cond4, req.params.cond5);
    //res.send(req.params.report + " " + req.params.cond1 + " " + req.params.cond2 + " " + req.params.cond3 + " " + req.params.cond4 + " " + req.params.cond5);
    //console.log(req.params.report);
    //console.log(reportDictionary[req.params.report]);
    //console.log(reportDictionary[req.params.report].replace("?1", req.params.cond1));

    var result = [];

    pool.acquire(function(err, connection) {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Connection successful');

        var stmt = reportDictionary[req.params.report].stmt;

        if (req.params.report == "2671") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
            stmt = stmt.replace("?3", req.params.cond3);

        } else if (req.params.report == "2672") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
        }

        var request = new Request(stmt, function(err, rowCount) {
            if (err) {
                console.error(err);
                return;
            }
            //console.log('rowCount: ' + rowCount);


            connection.release();

            // Form PDF File Here...
            //req.test2 = result;
            //console.log(result);

            res.setHeader('Content-disposition', 'attachment; filename=' + reportDictionary[req.params.report].filename + '.pdf');
            res.setHeader('Content-type', 'application/pdf');
            var rowOffset = 100;
            var columnOffset = -20;
            //console.log(result[i][j]);
            doc.font('public/fonts/THSarabunBold.ttf')
                .fontSize(14)
                .text(reportDictionary[req.params.report].title, 50, 50);

            var headers = reportDictionary[req.params.report].header.split(",");
            for (i = 0; i < headers.length; i++) {
                doc.font('public/fonts/THSarabunBold.ttf')
                    .fontSize(6)
                    .text(headers[i], columnOffset += 100, 80);
            }
            columnOffset = -20;

            for (i = 0; i < result.length; i++) {
                if ((i % 30 == 0) && (i > 0)) {
                    doc.addPage();
                    rowOffset = 100;
                }

                for (j = 0; j < result[i].length; j++) {
                    //columnOffset = columnOffset + 20;
                    doc.font('public/fonts/THSarabunBold.ttf')
                        .fontSize(6)
                        .text(result[i][j], columnOffset += 100, rowOffset);
                }
                rowOffset = rowOffset + 20;
                columnOffset = -20;
            }
            doc.pipe(res);
            doc.end();
            //res.send('fewfwe');

        });

        request.on('row', function(columns) {
            var resultCol = [];
            columns.forEach(function(column) {

                if (column.value === null) {
                    //console.log('NULL');
                } else {

                    resultCol.push(column.value);
                    //console.log(column.value);
                }
            });
            result.push(resultCol);

        });
        connection.execSql(request);
    });

});

module.exports = router;