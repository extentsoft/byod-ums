var express = require('express');
var pool = require('../../modules/mssql').pool;
var Request = require('tedious').Request;
var router = express.Router();

var PDFDocument = require('pdfkit');
var blobStream = require('blob-stream');
var request = require('request');

//var stream = doc.pipe(blobStream())
const reportDictionary = {
	"2671": {
        stmt: "SELECT [userName] 'User', [devicemac] MAC,[os_name] 'OS',[created_at] 'Date',[orgName] 'group' FROM [AgileControllerDB].[dbo].[UMS_ActivityLog] a join [AgileControllerDB].[dbo].[TSM_E_Endpoint] c on a.[devicemac] = c.[mac] join [AgileControllerDB].[dbo].[TSM_E_Account] b on a.userId = b.account join [AgileControllerDB].[dbo].[TSM_E_Organization] d on b.orgID = d.orgID where detail = 'AddDevice'  and CONVERT (date, created_at) between '?1' and '?2' and [orgName] = '?3'",
        header: "เจ้าของอุปกรณ์,MAC Address,ระบบปฏิบัติการ,วันที่ลงทะเบียนอุปกรณ์,กลุ่มผู้ใช้งาน",
        title: "รายงานการลงทะเบียนอุปกรณ์ : ระหว่างวันที่ ?1 ถึง ?2 แบ่งด้วยกลุ่ม ?3",
        filename: "report"
    },
	"2672": {
        stmt: "SELECT userName account,terminalMac MAC, [orgName] 'group',timestamp FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] where CONVERT (date, timestamp) between '?1' and '?2' and [orgName] = '?3' and sessionID !=''",
        header: "เจ้าของอุปกรณ์,MAC Address,กลุ่มผู้ใช้งาน,วันที่เข้าใช้งาน",
        title: "รายงานการใช้งานของแต่ละกลุ่ม : ระหว่างวันที่ ?1 ถึง ?2 แบ่งด้วยกลุ่ม ?3",
        filename: "report"
    },
	"2673": {
        stmt: "SELECT [userName] 'User',[devicemac] 'MAC',[os_name] 'OS',[created_at] 'Date' FROM [AgileControllerDB].[dbo].[UMS_ActivityLog] a join [AgileControllerDB].[dbo].[TSM_E_Account] b on  a.[userId] = b.[account] join [AgileControllerDB].[dbo].[TSM_E_Endpoint] c on a.[devicemac] = c.[mac] where detail = 'DeleteDevice' and CONVERT (date, created_at) between '?1' and '?2'",
        header: "เจ้าของอุปกรณ์,MAC Address,ระบบปฏิบัติการ,วันที่ยกเลิกอุปกรณ์",
        title: "รายงานการยกเลิกการใช้งานอุปกรณ์ : ระหว่างวันที่ ?1 ถึง ?2",
        filename: "report"
    },
	"2674": {
        stmt: "SELECT [userId],[detail],[created_at] FROM [AgileControllerDB].[dbo].[UMS_violationlog] a where CONVERT (date, created_at) between '?1' and '?2' and [detail] = '?3'",
        header: "ชื่อผู้ใช้งาน,ประเภทกฎที่ผู้ใช้งานละเมิด,วันที่ที่ผู้ใช้งานละเมิดกฎ",
        title: "รายงานการพยายามใช้งานที่ไม่เป็นไปตามกฎ : ระหว่างวันที่ ?1 ถึง ?2 ประเภทกฎที่ผู้ใช้งานละเมิด : ?3",
        filename: "report"
    },
	"2675": {
        stmt: "SELECT a.userName Account,a.terminalMac MAC,os_name,timestamp 'Date',b.[description] Area FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] a join [AgileControllerDB].[dbo].[UMS_Site] b on [radiusClientIp] = [ipaddr] join [AgileControllerDB].[dbo].[TSM_E_Endpoint] e on a.terminalMac = e.mac where CONVERT (date, a.timestamp) between '?1' and '?2' and b.[name] = '?3'",
        header: "เจ้าของอุปกรณ์,MAC Address,ระบบปฏิบัติการ,วันที่เข้าใช้งาน,พื้นที่",
        title: "รายงานการใช้งานจําแนกตามพื้นที่ : ระหว่างวันที่ ?1 ถึง ?2 แบ่งด้วยพื้นที่ ?3",
        filename: "report"
    },
	"2676": {
        stmt: "SELECT userName account,terminalMac MAC, [orgName] 'group',count(*) FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] where  CONVERT (date, timestamp) between '?1' and '?2' and [orgName] = '?3' and terminalMac != '' group by userName,terminalMac, [orgName]",
        header: "เจ้าของอุปกรณ์,MAC Address,กลุ่มผู้ใช้งาน,จำนวนที่เข้าใช้งาน",
        title: "รายงานการใช้งานจําแนกตามกลุ่ม : ระหว่างวันที่ ?1 ถึง ?2 แบ่งด้วยกลุ่ม ?3",
        filename: "report"
    },
	"2677": {
        stmt: "SELECT [userName],[os_name],[terminalIp],[timestamp] FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] a join [AgileControllerDB].[dbo].[TSM_E_Endpoint] b on a.[terminalMac] = b.mac where terminalIp!= '' and CONVERT (date, timestamp) between '?1' and '?2' and userName like '%?3%'",
        header: "เจ้าของอุปกรณ์,ระบบปฏิบัติการ,IP,วันที่ใช้งาน",
        title: "รายงานการใช้งานระบุบุคคล : ระหว่างวันที่ ?1 ถึง ?2",
        filename: "report"
    },
	"2678": {
        stmt: "SELECT userName Account,CASE WHEN b.[os_name] = 'Android' or b.[os_name] = 'iOS' THEN 'Mobile' WHEN b.[os_name] like 'Windows%' or b.[os_name] = 'Linux' or b.[os_name] = 'OSX' THEN 'Computer' ELSE 'Unknown' END as 'Type',orgName 'Group',mac,timestamp 'Date' FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] a join [AgileControllerDB].[dbo].[TSM_E_Endpoint] b on a.[terminalMac] = b.mac where CONVERT (date, a.timestamp) between '?1' and '?2' and CASE WHEN b.[os_name] = 'Android' or b.[os_name] = 'iOS' THEN 'Mobile' WHEN b.[os_name] like 'Windows%' or b.[os_name] = 'Linux' or b.[os_name] = 'OSX' THEN 'Computer' ELSE 'Unknown' END = '?3'",
        header: "เจ้าของอุปกรณ์,ประเภทอุปกรณ์,กลุ่มผู้ใช้งาน,MAC Address,วันที่เข้าใช้งาน",
        title: "รายงานการใช้งานจําแนกตามประเภทอุปกรณ์ : ระหว่างวันที่ ?1 ถึง ?2 แบ่งด้วยประเภท ?3",
        filename: "report"
    },
	"2679": {
        stmt: "SELECT userName account,terminalMac MAC, [os_name] 'OS',timestamp FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] a join [AgileControllerDB].[dbo].[TSM_E_Endpoint] e on a.terminalMac = e.mac where sessionID != '' and CONVERT (date, timestamp) between '?1' and '?2' and CONVERT (time,timestamp) < CONVERT (time,'?4' ) and CONVERT (time,timestamp) > CONVERT (time,'?3')",
        header: "เจ้าของอุปกรณ์,MAC Address,ระบบปฏิบัติการ,วันที่เข้าใช้งาน",
        title: "รายงานการใช้งานจําแนกตามเวลา : ระหว่างวันที่ ?1 ถึง ?2 ในช่วงเวลา ?3 ถึง ?4",
        filename: "report"
    },
	"26710": {
        stmt: "SELECT [accountID],[account],[userName],[orgName], (select count(*) from [AgileControllerDB].[dbo].[TSM_E_Endpoint] where login_account = t1.account), CASE when t1.[accountID] in (select [user_id] from [AgileControllerDB].[dbo].[UMS_Limitdevice]) then (SELECT [limitdevice] FROM [AgileControllerDB].[dbo].[UMS_Limitdevice] where [user_id] = t1.[accountID]) else (SELECT [limitdevice] FROM [AgileControllerDB].[dbo].[UMS_Limitdevice] where [user_id] = '999999' ) END as limit FROM [AgileControllerDB].[dbo].[TSM_E_Account] t1 join [AgileControllerDB].[dbo].[TSM_E_Organization] t2 on t1.[orgID] = t2.[orgID] where orgName != 'Guest' and (select count(*) from [AgileControllerDB].[dbo].[TSM_E_Endpoint] where login_account = t1.account) = CASE when t1.[accountID] in (select [user_id] from [AgileControllerDB].[dbo].[UMS_Limitdevice]) then (SELECT [limitdevice] FROM [AgileControllerDB].[dbo].[UMS_Limitdevice] where [user_id] = t1.[accountID]) else (SELECT [limitdevice] FROM [AgileControllerDB].[dbo].[UMS_Limitdevice] where [user_id] = '999999' ) END ",
        header: "ชื่อผู้ใช้งาน,ชื่อ-นามสกุล จริง,กลุ่มผู้ใช้งาน,จำนวนอุปกรณ์ที่ลงทะเบียน,จำนวนอุปกรณ์สูงสุดที่ได้รับอนุญาต",
        title: "รายงานการใช้งานของบุคลากรที่ครบตามจํานวนอุปกรณ์ที่อนุญาต",
        filename: "report"
    },
	"267141": {
        stmt: "SELECT a.userName Account,a.terminalMac MAC,os_name,count(*),b.[description] Area FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] a join [AgileControllerDB].[dbo].[UMS_Site] b on [radiusClientIp] = [ipaddr] join [AgileControllerDB].[dbo].[TSM_E_Endpoint] e on a.terminalMac = e.mac where CONVERT (date, a.timestamp) between '?1' and '?2' and sessionID !='' and b.[name] = '?3' group by b.[description],a.userName,a.terminalMac,os_name",
        header: "เจ้าของอุปกรณ์,MAC Address,ระบบปฏิบัติการ,จำนวนครั้งที่เข้าใช้งาน,พื้นที่",
        title: "รายงานการใช้งานทรัพยากรระบบ - จำแนกตามพื้นที่การใช้งาน : ระหว่างวันที่ ?1 ถึง ?2 แบ่งด้วยพื้นที่ ?3",
        filename: "report"
    },
	"267142": {
        stmt: "SELECT DATEPART(hh,timestamp) h,count(*) n FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] a where CONVERT (date, timestamp) = CONVERT (date, current_timestamp) and [sessionID]!= '' group by DATEPART(hh,timestamp) order by DATEPART(hh,timestamp) asc",
        header: "ช่วงเวลา,จำนวนการเข้าใช้งาน",
        title: "รายงานการใช้งานทรัพยากรระบบ - ปริมาณจราจรเครือข่ายของวันนี้",
        filename: "report"
    },
	"267143": {
        stmt: "SELECT b.[name],count(*) FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] a join [AgileControllerDB].[dbo].[UMS_Site] b on [radiusClientIp] = [ipaddr] where sessionID != '' and CONVERT (date, a.timestamp) between '?1' and '?2' and b.[name] = '?3' group by b.[name]",
        header: "Controller,จำนวนการเข้าใช้งาน",
        title: "รายงานการใช้งานทรัพยากรระบบ - แสดงจำนวนผู้ใช้งาน : ระหว่างวันที่ ?1 ถึง ?2 แบ่งด้วยพื้นที่ ?3",
        filename: "report"
    },
	"267151": {
        stmt: "SELECT userName account,terminalMac MAC,count(*) FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] where sessionID != '' and  CONVERT (date, timestamp) between '?1' and '?2' and [orgName] = '?3' and terminalMac != '' group by userName,terminalMac, [orgName]",
        header: "เจ้าของอุปกรณ์,MAC Address,จำนวนการเข้าใช้งาน",
        title: "รายงานการใช้งานจำแนกตามอุปกรณ์ผู้ใช้งาน : ระหว่างวันที่ ?1 ถึง ?2 แบ่งด้วยกลุ่ม ?3",
        filename: "report"
    },
	"267152": {
        stmt: "SELECT [os_name] OS,accountName Account, terminalMac MAC, timestamp 'Date' FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] a join [AgileControllerDB].[dbo].[TSM_E_Endpoint] b on a.[terminalMac] = b.mac where sessionID != '' and CONVERT (date, timestamp) between '?1' and '?2' and [os_name] = '?3'",
        header: "เจ้าของอุปกรณ์,MAC Address,ประเภทระบบปฎิบัติการ,วันที่เข้าใช้งาน",
        title: "รายงานการใช้งานจำแนกตามระบบปฎิบัติการ : ระหว่างวันที่ ?1 ถึง ?2 ประเภทระบบปฎิบัติการ ?3",
        filename: "report"
    },
	"267153": {
        stmt: "SELECT [userId] 'User',[browser],created_at 'Date' FROM [AgileControllerDB].[dbo].[UMS_AccessLog] where  [browser]!='undefined' and CONVERT (date, created_at) between '?1' and '?2' and [browser] = '?3'",
        header: "ชื่อผู้ใช้งาน,ขื่อ Browser,วันที่เข้าใช้งาน",
        title: "รายงานการใช้งานจำแนกตาม Browser : ระหว่างวันที่ ?1 ถึง ?2 แบ่งประเภท Browser ?3",
        filename: "report"
    },
	"267154": {
        stmt: "SELECT b.[description],count(*) FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] a join [AgileControllerDB].[dbo].[UMS_Site] b on [radiusClientIp] = [ipaddr] where CONVERT (date, a.timestamp) between '?1' and '?2' and b.[name] = '?3' group by b.[description]",
        header: "พื้นที่,จำนวนการเข้าใช้งาน",
        title: "รายงานการใช้งานจำแนกตามสถานที่การใช้งาน : ระหว่างวันที่ ?1 ถึง ?2 ",
        filename: "report"
    },

	"2681": {
        stmt: "SELECT [userName],count(*) FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] a join [AgileControllerDB].[dbo].[TSM_E_Endpoint] b on a.[terminalMac] = b.mac where terminalIp!= '' and CONVERT (date, timestamp) between '?1' and '?2' and userName like '%?3%' group by [userName]",
        header: "ชื่อผู้ใช้งาน,จำนวนครั้งที่เข้าใช้งาน",
        title: "รายงานสถิติผู้ใช้งาน แบ่งตาม ชื่อผู้ใช้งาน : ระหว่างวันที่ ?1 ถึง ?2",
        filename: "report"
    },
	"2682": {
        stmt: "SELECT [terminalMac],count(*) FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] where [sessionID] != '' and terminalIp!= '' and CONVERT (date, timestamp) between '?1' and '?2' and [terminalMac] like '%?3%' group by [terminalMac]",
        header: "MAC Address,จำนวนครั้งที่เข้าใช้งาน",
        title: "รายงานสถิติผู้ใช้งาน แบ่งตาม MAC Address : ระหว่างวันที่ ?1 ถึง ?2",
        filename: "report"
    },
	"2683": {
        stmt: "SELECT [userNAme],[terminalMac],[timestamp] FROM [AgileControllerDB].[dbo].[UMS_DeviceMonLog] where CONVERT (date, timestamp) between '?1' and '?2'",
        header: "เจ้าของอุปกรณ์,MAC Address,วันที่เข้าใช้งาน",
        title: "รายงานการเข้าใช้งานของอุปกรณ์ที่ถูกระบุไว้ : ระหว่างวันที่ ?1 ถึง ?2",
        filename: "report"
    },
	"2684": {
        stmt: "SELECT [userName] 'User' ,[orgName] 'group',count(*) FROM [AgileControllerDB].[dbo].[UMS_ActivityLog] a join [AgileControllerDB].[dbo].[TSM_E_Endpoint] c on a.[devicemac] = c.[mac] join [AgileControllerDB].[dbo].[TSM_E_Account] b on a.userId = b.account join [AgileControllerDB].[dbo].[TSM_E_Organization] d on b.orgID = d.orgID where detail = 'AddDevice'  and CONVERT (date, created_at) between '?1' and '?2' and [orgName] = '?3' group by [userName],[detail],[orgName]",
        header: "เจ้าของอุปกรณ์,กลุ่มผู้ใช้งาน,จำนวนครั้งที่ลงทะเบียน",
        title: "รายงานสถิติการลงทะเบียนอุปกรณ์ แบ่งตาม กลุ่มผู้ใช้งาน : ระหว่างวันที่ ?1 ถึง ?2 แบ่งด้วยกลุ่ม ?3",
        filename: "report"
    },
	"2685": {
        stmt: "SELECT [userName] 'User' ,[orgName] 'group',count(*) FROM [AgileControllerDB].[dbo].[UMS_ActivityLog] a join [AgileControllerDB].[dbo].[TSM_E_Endpoint] c on a.[devicemac] = c.[mac] join [AgileControllerDB].[dbo].[TSM_E_Account] b on a.userId = b.account join [AgileControllerDB].[dbo].[TSM_E_Organization] d on b.orgID = d.orgID where detail = 'DeleteDevice'  and CONVERT (date, created_at) between '?1' and '?2' and [orgName] = '?3' group by [userName],[detail],[orgName]",
        header: "เจ้าของอุปกรณ์,กลุ่มผู้ใช้งาน,จำนวนครั้งที่เพิกถอน",
        title: "รายงานสถิติการเพิกถอนอุปกรณ์ แบ่งตาม กลุ่มผู้ใช้งาน : ระหว่างวันที่ ?1 ถึง ?2 แบ่งด้วยกลุ่ม ?3",
        filename: "report"
    },
	"2686": {
        stmt: "SELECT [userName] 'User' ,count(*) FROM [AgileControllerDB].[dbo].[UMS_ActivityLog] a  join [AgileControllerDB].[dbo].[TSM_E_Account] b on a.userId = b.account join [AgileControllerDB].[dbo].[TSM_E_Organization] d on b.orgID = d.orgID where detail = 'EditProfile' and CONVERT (date, created_at) between '?1' and '?2' and [userName] like '%?3%' group by [userName],[detail]",
        header: "ชื่อผู้ใช้งาน,จำนวนครั้งที่ปรับปรุงข้อมูลส่วนตัว",
        title: "รายงานสถิติการปรับปรุงข้อมูล แบ่งตาม ชื่อผู้ใช้งาน : ระหว่างวันที่ ?1 ถึง ?2",
        filename: "report"
    },
	"2687": {
        stmt: "SELECT [orgName] 'group',count(*) FROM [AgileControllerDB].[dbo].[UMS_ActivityLog] a  join [AgileControllerDB].[dbo].[TSM_E_Account] b on a.userId = b.account join [AgileControllerDB].[dbo].[TSM_E_Organization] d on b.orgID = d.orgID where detail = 'EditProfile' and CONVERT (date, created_at) between '?1' and '?2' and [orgName] = '?3' group by [orgName],[detail]",
        header: "กลุ่มผู้ใช้งาน,จำนวนครั้งที่ปรับปรุงข้อมูลส่วนตัว",
        title: "รายงานสถิติการปรับปรุงข้อมูล แบ่งตาม กลุ่มผู้ใช้งาน : ระหว่างวันที่ ?1 ถึง ?2 แบ่งด้วยกลุ่ม ?3",
        filename: "report"
    },
	"2688": {
        stmt: "SELECT userName 'User', terminalMac MAC,[os_name] OS,count(*),case when (select description from [AgileControllerDB].[dbo].[UMS_Site] where ipaddr = radiusClientIp) is not null then (select description from [AgileControllerDB].[dbo].[UMS_Site] where ipaddr = radiusClientIp)  else  '' end FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] a join [AgileControllerDB].[dbo].[TSM_E_Endpoint] b on a.[terminalMac] = b.mac where sessionID != '' and CONVERT (date, timestamp) between '?1' and '?2' and [os_name] = 'iOS' group by [os_name],userName, terminalMac,radiusClientIp",
        header: "เจ้าของอุปกรณ์,MAC Address,ระบบปฏิบัติการ,จำนวนครั้งที่เข้าใช้งาน,พื้นที่",
        title: "รายงานสถิติการใช้งานระบบปฏิบัติการ iOS : ระหว่างวันที่ ?1 ถึง ?2",
        filename: "report"
    },
	"2689": {
        stmt: "SELECT userName 'User', terminalMac MAC,[os_name] OS,count(*),case when (select description from [AgileControllerDB].[dbo].[UMS_Site] where ipaddr = radiusClientIp) is not null then (select description from [AgileControllerDB].[dbo].[UMS_Site] where ipaddr = radiusClientIp)  else  '' end FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] a join [AgileControllerDB].[dbo].[TSM_E_Endpoint] b on a.[terminalMac] = b.mac where sessionID != '' and CONVERT (date, timestamp) between '?1' and '?2' and [os_name] = 'Android' group by [os_name],userName, terminalMac,radiusClientIp",
        header: "เจ้าของอุปกรณ์,MAC Address,ระบบปฏิบัติการ,จำนวนครั้งที่เข้าใช้งาน,พื้นที่",
        title: "รายงานสถิติการใช้งานระบบปฏิบัติการ Android : ระหว่างวันที่ ?1 ถึง ?2",
        filename: "report"
    },
	"26810": {
        stmt: "SELECT userName 'User', terminalMac MAC,[os_name] OS,count(*),case when (select description from [AgileControllerDB].[dbo].[UMS_Site] where ipaddr = radiusClientIp) is not null then (select description from [AgileControllerDB].[dbo].[UMS_Site] where ipaddr = radiusClientIp)  else  '' end FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] a join [AgileControllerDB].[dbo].[TSM_E_Endpoint] b on a.[terminalMac] = b.mac where sessionID != '' and CONVERT (date, timestamp) between '?1' and '?2' and [os_name] like '%Windows%' group by [os_name],userName, terminalMac,radiusClientIp",
        header: "เจ้าของอุปกรณ์,MAC Address,ระบบปฏิบัติการ,จำนวนครั้งที่เข้าใช้งาน,พื้นที่",
        title: "รายงานสถิติการใช้งานระบบปฏิบัติการ Windows : ระหว่างวันที่ ?1 ถึง ?2",
        filename: "report"
    },
	"26811": {
        stmt: "SELECT userName 'User', terminalMac MAC,[os_name] OS,count(*),case when (select description from [AgileControllerDB].[dbo].[UMS_Site] where ipaddr = radiusClientIp) is not null then (select description from [AgileControllerDB].[dbo].[UMS_Site] where ipaddr = radiusClientIp)  else  '' end FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] a join [AgileControllerDB].[dbo].[TSM_E_Endpoint] b on a.[terminalMac] = b.mac where sessionID != '' and CONVERT (date, timestamp) between '?1' and '?2' and [os_name] = 'Linux' group by [os_name],userName, terminalMac,radiusClientIp",
        header: "เจ้าของอุปกรณ์,MAC Address,ระบบปฏิบัติการ,จำนวนครั้งที่เข้าใช้งาน,พื้นที่",
        title: "รายงานสถิติการใช้งานระบบปฏิบัติการ Linux : ระหว่างวันที่ ?1 ถึง ?2",
        filename: "report"
    },
	"26812": {
        stmt: "SELECT userName 'User', terminalMac MAC,[os_name] OS,count(*),case when (select description from [AgileControllerDB].[dbo].[UMS_Site] where ipaddr = radiusClientIp) is not null then (select description from [AgileControllerDB].[dbo].[UMS_Site] where ipaddr = radiusClientIp)  else  '' end FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] a join [AgileControllerDB].[dbo].[TSM_E_Endpoint] b on a.[terminalMac] = b.mac where sessionID != '' and CONVERT (date, timestamp) between '?1' and '?2' and [os_name] = '' group by [os_name],userName, terminalMac,radiusClientIp",
        header: "เจ้าของอุปกรณ์,MAC Address,ระบบปฏิบัติการ,จำนวนครั้งที่เข้าใช้งาน,พื้นที่",
        title: "รายงานสถิติการใช้งานระบบปฏิบัติการอื่นๆ : ระหว่างวันที่ ?1 ถึง ?2",
        filename: "report"
    },
	"26813": {
        stmt: "SELECT userName 'User', b.[os_name] os,count(*),case when (select description from [AgileControllerDB].[dbo].[UMS_Site] where ipaddr = radiusClientIp) is not null then (select description from [AgileControllerDB].[dbo].[UMS_Site] where ipaddr = radiusClientIp)  else  '' end FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] a join [AgileControllerDB].[dbo].[TSM_E_Endpoint] b on a.[terminalMac] = b.mac where sessionID != '' and CONVERT (date, timestamp) between '?1' and '?2' and CASE WHEN b.[os_name] = 'Android' or b.[os_name] = 'iOS' THEN 'Mobile' WHEN b.[os_name] like '%Windows%' or b.[os_name] = 'Linux' or b.[os_name] = 'OSX' THEN 'Computer' ELSE '' END = 'Computer' group by b.[os_name],userName,radiusClientIp",
        header: "เจ้าของอุปกรณ์,ประเภทอุปกรณ์,จำนวนครั้งที่เข้าใช้งาน,พื้นที่",
        title: "รายงานสถิติการใช้งานของอุปกรณ์ประเภท Computer : ระหว่างวันที่ ?1 ถึง ?2",
        filename: "report"
    },
	"26814": {
        stmt: "SELECT userName 'User', b.[os_name] os,count(*),case when (select description from [AgileControllerDB].[dbo].[UMS_Site] where ipaddr = radiusClientIp) is not null then (select description from [AgileControllerDB].[dbo].[UMS_Site] where ipaddr = radiusClientIp)  else  '' end FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] a join [AgileControllerDB].[dbo].[TSM_E_Endpoint] b on a.[terminalMac] = b.mac where sessionID != '' and CONVERT (date, timestamp) between '?1' and '?2' and CASE WHEN b.[os_name] = 'Android' or b.[os_name] = 'iOS' THEN 'Mobile' WHEN b.[os_name] like '%Windows%' or b.[os_name] = 'Linux' or b.[os_name] = 'OSX' THEN 'Computer' ELSE '' END = 'Mobile' group by b.[os_name],userName,radiusClientIp",
        header: "เจ้าของอุปกรณ์,ประเภทอุปกรณ์,จำนวนครั้งที่เข้าใช้งาน,พื้นที่",
        title: "รายงานสถิติการใช้งานของอุปกรณ์ประเภท Mobile : ระหว่างวันที่ ?1 ถึง ?2",
        filename: "report"
    },
	"26815": {
        stmt: "SELECT userName 'User', b.[os_name] os,count(*),case when (select description from [AgileControllerDB].[dbo].[UMS_Site] where ipaddr = radiusClientIp) is not null then (select description from [AgileControllerDB].[dbo].[UMS_Site] where ipaddr = radiusClientIp)  else  '' end FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] a join [AgileControllerDB].[dbo].[TSM_E_Endpoint] b on a.[terminalMac] = b.mac where sessionID != '' and CONVERT (date, timestamp) between '?1' and '?2' and CASE WHEN b.[os_name] = 'Android' or b.[os_name] = 'iOS' THEN 'Mobile' WHEN b.[os_name] like '%Windows%' or b.[os_name] = 'Linux' or b.[os_name] = 'OSX' THEN 'Computer' ELSE '' END = '' group by b.[os_name],userName,radiusClientIp",
        header: "เจ้าของอุปกรณ์,ประเภทอุปกรณ์,จำนวนครั้งที่เข้าใช้งาน,พื้นที่",
        title: "รายงานสถิติการใช้งานของอุปกรณ์ประเภทอื่นๆ : ระหว่างวันที่ ?1 ถึง ?2",
        filename: "report"
    },
	"2714": {
        stmt: "SELECT [userName] 'User',detail 'Event',[devicemac] 'MAC',[os_name] 'OS',[created_at] 'Date' FROM [AgileControllerDB].[dbo].[UMS_ActivityLog] a join [AgileControllerDB].[dbo].[TSM_E_Account] b on  a.[userId] = b.[account] join [AgileControllerDB].[dbo].[TSM_E_Endpoint] c on a.[devicemac] = c.[mac] where detail = '?3' and CONVERT (date, created_at) between '?1' and '?2'",
        header: "เจ้าของอุปกรณ์,ประเภทการเปลี่ยนแปลง,MAC Address,ระบบปฏิบัติการ,วันที่เข้าใช้งาน",
        title: "รายงานการเปลี่ยนแปลงอุปกรณ์ : ระหว่างวันที่ ?1 ถึง ?2 ประเภทการเปลี่ยนแปลง : ?3",
        filename: "report"
    }
};



router.get('/:report/:cond1/:cond2/:cond3/:cond4/:cond5', function(req, res, next) {
	var doc = new PDFDocument();
    console.log(req.params.report, req.params.cond1, req.params.cond2, req.params.cond3, req.params.cond4, req.params.cond5);
    //console.log(req.params.report);
    //console.log(reportDictionary[req.params.report]);
    //console.log(reportDictionary[req.params.report].replace("?1", req.params.cond1));
	
	var result = [];
	var cond3 = '';
	if(req.params.cond3 == 'People'){
		cond3 = 'Officer';
	} 
	
	else if(req.params.cond3 == 'overlogin'){
		cond3 = 'เข้าสู่ระบบนอกช่วงเวลาที่ได้รับอนุญาต';
	}
	
	else if(req.params.cond3 == 'outoftime'){
		cond3 = 'เข้าสู่ระบบนอกช่วงเวลาที่ได้รับอนุญาต';
	}
	
	else if(req.params.cond3 == 'devicemon'){
		cond3 = 'มีการเข้าใช้งานระบบด้วยอุปกรณ์ที่ถูกกำหนดให้ตรวจสอบ';
	}
	
	else if(req.params.cond3 == 'editdeivceoverlimit'){
		cond3 = 'มีการลงทะเบียน-เพิกถอนอุปกรณ์มากเกินกว่าที่กำหนดไว้ในหนึ่งวัน';
	}
	
	else if(req.params.cond3 == 'accessdiffsite'){
		cond3 = 'มีการเข้าใช้งานต่างสถานที่ในระยะเวลาที่สั้นเกินกว่าที่กำหนดไว้ในระบบ';
	}
	
	else if(req.params.cond3 == 'overeditprofile'){
		cond3 = 'มีการแก้ไขข้อมูลส่วนตัวเกินจำนวนครั้งที่ระบุไว้ในระบบ';
	}
	
	else if(req.params.cond3 == 'AddDevice'){
		cond3 = 'ลงทะเบียนอุปกรณ์';
	}
	
	else if(req.params.cond3 == 'DeleteDevice'){
		cond3 = 'เพิกถอนอุปกรณ์';
	}
	
	else if(req.params.cond3 == 'EditDevice'){
		cond3 = 'แก้ไขข้อมูลอุปกรณ์';
	}
	
	else if(req.params.cond3 == ''){
		cond3 = 'ไม่สามารถระบุได้';
	}
	
	else {
		cond3 = req.params.cond3;
	}


    pool.acquire(function(err, connection) {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Connection successful');

        var stmt = reportDictionary[req.params.report].stmt;
        console.log(stmt);
		var title = reportDictionary[req.params.report].title;

        if (req.params.report == "2671") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
            stmt = stmt.replace("?3", req.params.cond3);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
            title = title.replace("?3", cond3);
        } else if (req.params.report == "2672") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			stmt = stmt.replace("?3", req.params.cond3);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
            title = title.replace("?3", cond3);
        } else if (req.params.report == "2673") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
        } else if (req.params.report == "2674") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			stmt = stmt.replace("?3", req.params.cond3);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
            title = title.replace("?3", cond3);
        } else if (req.params.report == "2675") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			stmt = stmt.replace("?3", req.params.cond3);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
            title = title.replace("?3", cond3);
        } else if (req.params.report == "2676") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			stmt = stmt.replace("?3", req.params.cond3);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
            title = title.replace("?3", cond3);
        } else if (req.params.report == "2677") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			stmt = stmt.replace("?3", req.params.cond3);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
        } else if (req.params.report == "2678") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			stmt = stmt.replace("?3", req.params.cond3);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
            title = title.replace("?3", cond3);
        } else if (req.params.report == "2679") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			stmt = stmt.replace("?3", req.params.cond3);
			stmt = stmt.replace("?4", req.params.cond4);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
			title = title.replace("?3", req.params.cond3);
            title = title.replace("?4", req.params.cond4);
        } else if (req.params.report == "26710") {
        } else if (req.params.report == "267141") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			stmt = stmt.replace("?3", req.params.cond3);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
            title = title.replace("?3", cond3);
        } else if (req.params.report == "267142") {
        } else if (req.params.report == "267143") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			stmt = stmt.replace("?3", req.params.cond3);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
            title = title.replace("?3", cond3);
        } else if (req.params.report == "267151") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			stmt = stmt.replace("?3", req.params.cond3);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
            title = title.replace("?3", cond3);
        } else if (req.params.report == "267152") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			stmt = stmt.replace("?3", req.params.cond3);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
            title = title.replace("?3", cond3);
        } else if (req.params.report == "267153") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			stmt = stmt.replace("?3", req.params.cond3);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
            title = title.replace("?3", cond3);
        } else if (req.params.report == "267154") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			stmt = stmt.replace("?3", req.params.cond3);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
        } else if (req.params.report == "2681") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			stmt = stmt.replace("?3", req.params.cond3);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
        } else if (req.params.report == "2682") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			stmt = stmt.replace("?3", req.params.cond3);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
        } else if (req.params.report == "2683") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
        } else if (req.params.report == "2684") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			stmt = stmt.replace("?3", req.params.cond3);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
            title = title.replace("?3", cond3);
        } else if (req.params.report == "2685") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			stmt = stmt.replace("?3", req.params.cond3);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
            title = title.replace("?3", cond3);
        } else if (req.params.report == "2686") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			stmt = stmt.replace("?3", req.params.cond3);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
        } else if (req.params.report == "2687") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			stmt = stmt.replace("?3", req.params.cond3);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
            title = title.replace("?3", cond3);
        } else if (req.params.report == "2688") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
        } else if (req.params.report == "2689") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
        } else if (req.params.report == "26810") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
        } else if (req.params.report == "26811") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
        } else if (req.params.report == "26812") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
        } else if (req.params.report == "26813") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
        } else if (req.params.report == "26814") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
        } else if (req.params.report == "26815") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
        } else if (req.params.report == "2714") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			stmt = stmt.replace("?3", req.params.cond3);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
            title = title.replace("?3", cond3);
        } else if (req.params.report == "267") {
            stmt = stmt.replace("?1", req.params.cond1);
            stmt = stmt.replace("?2", req.params.cond2);
			
			title = title.replace("?1", req.params.cond1);
            title = title.replace("?2", req.params.cond2);
        }
		console.log(stmt);
		
		

        var request = new Request(stmt, function(err, rowCount) {
            if (err) {
                console.error(err);
                return;
            }
            console.log('rowCount: ' + rowCount);
            console.log(JSON.stringify(result));
            req.test2 = result;
            connection.release();

            // Form PDF File Here...
            //req.test2 = result;
            //console.log(result);

            res.setHeader('Content-disposition', 'attachment; filename=' + reportDictionary[req.params.report].filename + '.pdf');
            res.setHeader('Content-type', 'application/pdf');
            var rowOffset = 130;
            var columnOffset = -20;
            //console.log(result[i][j]);
            doc.font('public/fonts/THSarabunBold.ttf')
                .fontSize(14)
                .text(title, 50, 50);

            var headers = reportDictionary[req.params.report].header.split(",");
            for (i = 0; i < headers.length; i++) {
				if(req.params.report == "2674" && i == 2){
					doc.font('public/fonts/THSarabunBold.ttf')
                    .fontSize(12)
                    .text(headers[i], columnOffset += 200, 100);
				}
				else if((req.params.report == "2675" || req.params.report == "267141" || req.params.report == "2688" || req.params.report == "2689" || req.params.report == "26810" || req.params.report == "26811" || req.params.report == "26812") && (i == 2 || i == 3)){
					doc.font('public/fonts/THSarabunBold.ttf')
                    .fontSize(12)
                    .text(headers[i], columnOffset += 80, 100);
				}
				else if((req.params.report == "267154" || req.params.report == "267143") && i == 1){
					doc.font('public/fonts/THSarabunBold.ttf')
                    .fontSize(12)
                    .text(headers[i], columnOffset += 220, 100);
				}
				else if(req.params.report == "267142" && i == 1){
					doc.font('public/fonts/THSarabunBold.ttf')
                    .fontSize(12)
                    .text(headers[i], columnOffset += 250, 100);
				}
				else {
					doc.font('public/fonts/THSarabunBold.ttf')
                    .fontSize(12)
                    .text(headers[i], columnOffset += 100, 100);
				}
            }
            columnOffset = -20;
			if(req.params.report == "267142"){
				
				for (i = 0; i < 24; i++) {					
						//columnOffset = columnOffset + 20;
						var time_ = '';
						var count_ = '';
						if(result.length > 0){
							if(result[0][0] == i){
								if(i < 10){
									//time_ = "0"+ result[0][0] + ":00 - "+result[0][1];
									time_ = "0"+ result[0][0] + ":00";
									//console.log(time_);
									doc.font('public/fonts/THSarabunBold.ttf')
									.fontSize(9)
									.text(time_, columnOffset += 100, rowOffset);
									doc.font('public/fonts/THSarabunBold.ttf')
									.fontSize(9)
									.text(result[0][1], columnOffset += 250, rowOffset);
									result.splice(0, 1);
								}
								else{
									//time_ = result[0][0] + ":00 - "+result[0][1];
									//console.log(time_);
									time_ = result[0][0] + ":00";
									doc.font('public/fonts/THSarabunBold.ttf')
									.fontSize(9)
									.text(time_, columnOffset += 100, rowOffset);
									doc.font('public/fonts/THSarabunBold.ttf')
									.fontSize(9)
									.text(result[0][1], columnOffset += 250, rowOffset);
									result.splice(0, 1);
								}
								
							} 
							else {
								if(i < 10){
									//time_ = "0"+ i + ":00 - 0";
									//console.log(time_);
									time_ = "0"+ i + ":00";
									doc.font('public/fonts/THSarabunBold.ttf')
									.fontSize(9)
									.text(time_, columnOffset += 100, rowOffset);
									doc.font('public/fonts/THSarabunBold.ttf')
									.fontSize(9)
									.text("0", columnOffset += 250, rowOffset);
								}
								else{
									//time_ = i + ":00 - 0";
									//console.log(time_);
									time_ = i + ":00";
									doc.font('public/fonts/THSarabunBold.ttf')
									.fontSize(9)
									.text(time_, columnOffset += 100, rowOffset);
									doc.font('public/fonts/THSarabunBold.ttf')
									.fontSize(9)
									.text("0", columnOffset += 250, rowOffset);
								}							
							}
						}
						else{
							if(i < 10){
								//time_ = "0"+ i + ":00 - 0";
								//console.log(time_);
								time_ = "0"+ i + ":00";
								doc.font('public/fonts/THSarabunBold.ttf')
								.fontSize(9)
								.text(time_, columnOffset += 100, rowOffset);
								doc.font('public/fonts/THSarabunBold.ttf')
								.fontSize(9)
								.text("0", columnOffset += 250, rowOffset);
							}
							else{
								//time_ = i + ":00 - 0";
								//console.log(time_);
								time_ = i + ":00";
								doc.font('public/fonts/THSarabunBold.ttf')
								.fontSize(9)
								.text(time_, columnOffset += 100, rowOffset);
								doc.font('public/fonts/THSarabunBold.ttf')
								.fontSize(9)
								.text("0", columnOffset += 250, rowOffset);
							}
							
						}
						
						
					rowOffset = rowOffset + 20;
					columnOffset = -20;
				}
				
			}
			
			
			else
			{
				for (i = 0; i < result.length; i++) {
					if ((i % 28 == 0) && (i > 0)) {
						doc.addPage();
						rowOffset = 110;
						var headers = reportDictionary[req.params.report].header.split(",");
						for (p = 0; p < headers.length; p++) {
							if(req.params.report == "2674" && p == 2){
								doc.font('public/fonts/THSarabunBold.ttf')
								.fontSize(12)
								.text(headers[p], columnOffset += 200, 80);
							}
							else if((req.params.report == "2675" || req.params.report == "267141" || req.params.report == "2688" || req.params.report == "2689" || req.params.report == "26810" || req.params.report == "26811" || req.params.report == "26812") && (p == 2 || p == 3)){
								doc.font('public/fonts/THSarabunBold.ttf')
								.fontSize(12)
								.text(headers[p], columnOffset += 80, 100);
							}
							else if((req.params.report == "267154" || req.params.report == "267143") && p == 1){
								doc.font('public/fonts/THSarabunBold.ttf')
								.fontSize(12)
								.text(headers[p], columnOffset += 220, 100);
							}
							else {
								doc.font('public/fonts/THSarabunBold.ttf')
								.fontSize(12)
								.text(headers[p], columnOffset += 100, 80);
							}
						}
						columnOffset = -20;
					}

					for (j = 0; j < result[i].length; j++) {
						//columnOffset = columnOffset + 20;
						var res_ = '';
						if(result[i][j] == 'People'){
							res_ = 'Officer';
						} 
						
						else if(result[i][j] == 'overlogin'){
							res_ = 'เข้าสู่ระบบนอกช่วงเวลาที่ได้รับอนุญาต';
						}
						
						else if(result[i][j] == 'outoftime'){
							res_ = 'เข้าสู่ระบบนอกช่วงเวลาที่ได้รับอนุญาต';
						}
						
						else if(result[i][j] == 'devicemon'){
							res_ = 'มีการเข้าใช้งานระบบด้วยอุปกรณ์ที่ถูกกำหนดให้ตรวจสอบ';
						}
						
						else if(result[i][j] == 'editdeivceoverlimit'){
							res_ = 'มีการลงทะเบียน-เพิกถอนอุปกรณ์มากเกินกว่าที่กำหนดไว้ในหนึ่งวัน';
						}
						
						else if(result[i][j] == 'accessdiffsite'){
							res_ = 'มีการเข้าใช้งานต่างสถานที่ในระยะเวลาที่สั้นเกินกว่าที่กำหนดไว้ในระบบ';
						}
						
						else if(result[i][j] == 'overeditprofile'){
							res_ = 'มีการแก้ไขข้อมูลส่วนตัวเกินจำนวนครั้งที่ระบุไว้ในระบบ';
						}
						
						else if(result[i][j] == 'AddDevice'){
							res_ = 'ลงทะเบียนอุปกรณ์';
						}
						
						else if(result[i][j] == 'DeleteDevice'){
							res_ = 'เพิกถอนอุปกรณ์';
						}
						
						else if(result[i][j] == 'EditDevice'){
							res_ = 'แก้ไขข้อมูลอุปกรณ์';
						}
						
						else if(result[i][j] == ''){
							res_ = 'ไม่สามารถระบุได้';
						}
						
						else {
							res_ = result[i][j];
						}
						
						if(req.params.report == "2674" && j == 2){
							doc.font('public/fonts/THSarabunBold.ttf')
							.fontSize(9)
							.text(res_, columnOffset += 200, rowOffset);
						}
						else if((req.params.report == "2675" || req.params.report == "267141" || req.params.report == "2688" || req.params.report == "2689" || req.params.report == "26810" || req.params.report == "26811" || req.params.report == "26812") && (j == 2 || j == 3)){
							doc.font('public/fonts/THSarabunBold.ttf')
							.fontSize(9)
							.text(res_, columnOffset += 80, rowOffset);
						}
						else if((req.params.report == "267154" || req.params.report == "267143") && j == 1){
							doc.font('public/fonts/THSarabunBold.ttf')
							.fontSize(9)
							.text(res_, columnOffset += 220, rowOffset);
						}
						else {
							doc.font('public/fonts/THSarabunBold.ttf')
							.fontSize(9)
							.text(res_, columnOffset += 100, rowOffset);
						}
						
					}
					rowOffset = rowOffset + 20;
					columnOffset = -20;
				}
			}
            doc.pipe(res);
            doc.end();
            //res.send('fewfwe');

        });
		var gmtOffset = 0;
        var colData = "";
        request.on('row', function(columns) {
            var resultCol = [];
            columns.forEach(function(column) {

                if (column.value === null) {
                    //console.log('NULL');
                } else {
                    colData = column.value.toString();
                    gmtOffset = colData.search("GMT");
                    if (gmtOffset >= 0) {
                        resultCol.push(colData.substring(0, gmtOffset));
                    } else {
                        resultCol.push(colData);
                    }

                    //console.log(column.value);
                }
            });
            result.push(resultCol);

        });
        connection.execSql(request);
    });

});

module.exports = router;