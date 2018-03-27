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
    '267': 'select * from xxxx where xxx = ?1 and yyy = ?2',
    '268': 'select * from aaaa where ooo = ?1 and ppp = ?2',
};

router.get('/pdf/:report/:cond1', function(req, res, next) {
    console.log(req.params.report);
    console.log(reportDictionary[req.params.report]);
    console.log(reportDictionary[req.params.report].replace("?1", req.params.cond1));
    /*
        const reportDictionary = {
            '267': 'select * from xxxx where xxx = ?1 and yyy = ?2',
            '268': 'select * from aaaa where ooo = ?1 and ppp = ?2',
        };
    */
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
});

module.exports = router;