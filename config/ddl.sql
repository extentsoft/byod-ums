DROP TABLE IF EXISTS `UMS_AccessLog`;

CREATE TABLE `UMS_AccessLog` (
	`id` int NOT NULL,
	`browser` varchar(100) NULL,
	`ipaddr` varchar(15) NULL,
	`detail` varchar(100) NULL,
	`userId` varchar(50) NULL,
	`created_at` timestamp  NOT NULL,
	PRIMARY KEY (`id`)
);

-- Insert 0 entries into UMS_AccessLog


DROP TABLE IF EXISTS `UMS_AccountStatus`;

CREATE TABLE `UMS_AccountStatus` (
	`id` int NOT NULL,
	`status` varchar(100) NULL,
	PRIMARY KEY (`id`)
);

-- Insert 0 entries into UMS_AccountStatus


DROP TABLE IF EXISTS `UMS_ActivityLog`;

CREATE TABLE `UMS_ActivityLog` (
	`id` int NOT NULL,
	`detail` varchar(100) NULL,
	`userId` varchar(50) NULL,
	`created_at` timestamp  NOT NULL,
	PRIMARY KEY (`id`)
);

-- Insert 0 entries into UMS_ActivityLog


DROP TABLE IF EXISTS `UMS_AccountStaging`;

CREATE TABLE `UMS_AccountStaging` (
	`ID` int NOT NULL,
	`CN` varchar(150) NULL,
	`GECOS` varchar(150) NULL,
	`GIDNUMBER` varchar(20) NULL,
	`HOMEDIRECTORY` varchar(150) NULL,
	`LOGINSHELL` varchar(150) NULL,
	`OBJECTCLASS` text  NULL,
	`SHADOWLASTCHANGE` varchar(50) NULL,
	`SHADOWMAX` varchar(50) NULL,
	`SHADOWWARNING` varchar(50) NULL,
	`UID` varchar(50) NULL,
	`UIDNUMBER` varchar(20) NULL,
	`USERPASSWORD` text  NULL,
	`PER_ID` varchar(255) NULL,
	`PER_TYPE` varchar(255) NULL,
	`OT_CODE` varchar(255) NULL,
	`PN_CODE` varchar(255) NULL,
	`PER_NAME` varchar(255) NULL,
	`PER_SURNAME` varchar(255) NULL,
	`PER_ENG_NAME` varchar(255) NULL,
	`PER_ENG_SURNAME` varchar(255) NULL,
	`ORG_ID` varchar(255) NULL,
	`POS_ID` varchar(255) NULL,
	`POEM_ID` varchar(255) NULL,
	`LEVEL_NO` varchar(255) NULL,
	`PER_CARDNO` varchar(255) NULL,
	`PER_RETIREDATE` varchar(255) NULL,
	`PER_STARTDATE` varchar(255) NULL,
	`PER_OCCUPYDATE` varchar(255) NULL,
	`PER_STATUS` varchar(255) NULL,
	`DEPARTMENT_ID` varchar(255) NULL,
	`UPDATE_USER` varchar(255) NULL,
	`UPDATE_DATE` varchar(255) NULL,
	`PER_NICKNAME` varchar(255) NULL,
	`PER_MOBILE` varchar(255) NULL,
	`PER_EMAIL` varchar(255) NULL,
	`ES_CODE` varchar(255) NULL,
	`PL_NAME_WORK` varchar(255) NULL,
	`ORG_NAME_WORK` varchar(255) NULL,
	`PER_EFFECTIVEDATE` varchar(255) NULL,
	`PERSON_ID` decimal(5) NULL,
	`PERSON_TYPE_CODE` char(1) NULL,
	`PERSON_TITLE` varchar(50) NULL,
	`UNDER_DEPT_CODE` decimal(5) NULL,
	`UNDER_DEPT_NAME` varchar(150) NULL,
	`WORK_DEPT_CODE` decimal(5) NULL,
	`WORK_DEPT_NAME` varchar(150) NULL,
	`LINE_POSITION_NAME` varchar(150) NULL,
	`POSITION_NO` decimal(5) NULL,
	`EXC_POS_NAME` varchar(150) NULL,
	`SRCID` int NULL,
	`STATUSID` int NULL,
	`ISADMIN` bit  NULL,
	`SOCIAL_FB` varchar(150) NULL,
	`SOCIAL_LINE` varchar(150) NULL,
	PRIMARY KEY (`ID`)
);

-- Insert 0 entries into UMS_AccountStaging


DROP TABLE IF EXISTS `UMS_Account`;

CREATE TABLE `UMS_Account` (
	`ID` int NOT NULL,
	`CN` varchar(150) NULL,
	`GECOS` varchar(150) NULL,
	`GIDNUMBER` varchar(20) NULL,
	`HOMEDIRECTORY` varchar(150) NULL,
	`LOGINSHELL` varchar(150) NULL,
	`OBJECTCLASS` text  NULL,
	`SHADOWLASTCHANGE` varchar(50) NULL,
	`SHADOWMAX` varchar(50) NULL,
	`SHADOWWARNING` varchar(50) NULL,
	`UID` varchar(50) NULL,
	`UIDNUMBER` varchar(20) NULL,
	`USERPASSWORD` text  NULL,
	`PER_ID` varchar(255) NULL,
	`PER_TYPE` varchar(255) NULL,
	`OT_CODE` varchar(255) NULL,
	`PN_CODE` varchar(255) NULL,
	`PER_NAME` varchar(255) NULL,
	`PER_SURNAME` varchar(255) NULL,
	`PER_ENG_NAME` varchar(255) NULL,
	`PER_ENG_SURNAME` varchar(255) NULL,
	`ORG_ID` varchar(255) NULL,
	`POS_ID` varchar(255) NULL,
	`POEM_ID` varchar(255) NULL,
	`LEVEL_NO` varchar(255) NULL,
	`PER_CARDNO` varchar(255) NULL,
	`PER_RETIREDATE` varchar(255) NULL,
	`PER_STARTDATE` varchar(255) NULL,
	`PER_OCCUPYDATE` varchar(255) NULL,
	`PER_STATUS` varchar(255) NULL,
	`DEPARTMENT_ID` varchar(255) NULL,
	`UPDATE_USER` varchar(255) NULL,
	`UPDATE_DATE` varchar(255) NULL,
	`PER_NICKNAME` varchar(255) NULL,
	`PER_MOBILE` varchar(255) NULL,
	`PER_EMAIL` varchar(255) NULL,
	`ES_CODE` varchar(255) NULL,
	`PL_NAME_WORK` varchar(255) NULL,
	`ORG_NAME_WORK` varchar(255) NULL,
	`PER_EFFECTIVEDATE` varchar(255) NULL,
	`PERSON_ID` decimal(5) NULL,
	`PERSON_TYPE_CODE` char(1) NULL,
	`PERSON_TITLE` varchar(50) NULL,
	`UNDER_DEPT_CODE` decimal(5) NULL,
	`UNDER_DEPT_NAME` varchar(150) NULL,
	`WORK_DEPT_CODE` decimal(5) NULL,
	`WORK_DEPT_NAME` varchar(150) NULL,
	`LINE_POSITION_NAME` varchar(150) NULL,
	`POSITION_NO` decimal(5) NULL,
	`EXC_POS_NAME` varchar(150) NULL,
	`SRCID` int NULL,
	`STATUSID` int NULL,
	`ISADMIN` bit  NULL,
	`SOCIAL_FB` varchar(150) NULL,
	`SOCIAL_LINE` varchar(150) NULL,
	PRIMARY KEY (`ID`)
);

-- Insert 0 entries into UMS_Account


DROP TABLE IF EXISTS `UMS_DistrictMgmt`;

CREATE TABLE `UMS_DistrictMgmt` (
	`id` int NOT NULL,
	`name` varchar(100) NULL,
	`description` text  NULL,
	`updated_at` timestamp  NOT NULL,
	PRIMARY KEY (`id`)
);

-- Insert 0 entries into UMS_DistrictMgmt


DROP TABLE IF EXISTS `UMS_AreaMgmt`;

CREATE TABLE `UMS_AreaMgmt` (
	`id` int NOT NULL,
	`name` varchar(100) NULL,
	`description` text  NULL,
	`updated_at` timestamp  NOT NULL,
	`dmgmtid` int NULL,
	PRIMARY KEY (`id`)
);

-- Insert 0 entries into UMS_AreaMgmt


DROP TABLE IF EXISTS `UMS_Config`;

CREATE TABLE `UMS_Config` (
	`id` int NOT NULL,
	`c_name` varchar(100) NULL,
	`c_value` varchar(150) NULL,
	`modifierId` varchar(50) NULL,
	`updated_at` timestamp  NOT NULL,
	PRIMARY KEY (`id`)
);

-- Insert 0 entries into UMS_Config


DROP TABLE IF EXISTS `UMS_EOStaging`;

CREATE TABLE `UMS_EOStaging` (
	`ID` int NOT NULL,
	`PERSON_ID` decimal(5) NULL,
	`PERSON_NID` varchar(20) NULL,
	`PERSON_TYPE_CODE` char(1) NULL,
	`PERSON_TITLE` varchar(50) NULL,
	`PERSON_TH_NAME` varchar(100) NULL,
	`PERSON_TH_SURNAME` varchar(100) NULL,
	`UNDER_DEPT_CODE` decimal(5) NULL,
	`UNDER_DEPT_NAME` varchar(150) NULL,
	`WORK_DEPT_CODE` decimal(5) NULL,
	`WORK_DEPT_NAME` varchar(150) NULL,
	`LINE_POSITION_NAME` varchar(150) NULL,
	`POSITION_NO` decimal(5) NULL,
	`EXC_POS_NAME` varchar(150) NULL,
	PRIMARY KEY (`ID`)
);

-- Insert 0 entries into UMS_EOStaging


DROP TABLE IF EXISTS `UMS_DPISStaging`;

CREATE TABLE `UMS_DPISStaging` (
	`ID` int NOT NULL,
	`PER_ID` varchar(255) NULL,
	`PER_TYPE` varchar(255) NULL,
	`OT_CODE` varchar(255) NULL,
	`PN_CODE` varchar(255) NULL,
	`PER_NAME` varchar(255) NULL,
	`PER_SURNAME` varchar(255) NULL,
	`PER_ENG_NAME` varchar(255) NULL,
	`PER_ENG_SURNAME` varchar(255) NULL,
	`ORG_ID` varchar(255) NULL,
	`POS_ID` varchar(255) NULL,
	`POEM_ID` varchar(255) NULL,
	`LEVEL_NO` varchar(255) NULL,
	`PER_CARDNO` varchar(255) NULL,
	`PER_RETIREDATE` varchar(255) NULL,
	`PER_STARTDATE` varchar(255) NULL,
	`PER_OCCUPYDATE` varchar(255) NULL,
	`PER_STATUS` varchar(255) NULL,
	`DEPARTMENT_ID` varchar(255) NULL,
	`UPDATE_USER` varchar(255) NULL,
	`UPDATE_DATE` varchar(255) NULL,
	`PER_NICKNAME` varchar(255) NULL,
	`PER_MOBILE` varchar(255) NULL,
	`PER_EMAIL` varchar(255) NULL,
	`ES_CODE` varchar(255) NULL,
	`PL_NAME_WORK` varchar(255) NULL,
	`ORG_NAME_WORK` varchar(255) NULL,
	`PER_EFFECTIVEDATE` varchar(255) NULL,
	PRIMARY KEY (`ID`)
);

-- Insert 0 entries into UMS_DPISStaging


DROP TABLE IF EXISTS `UMS_Message`;

CREATE TABLE `UMS_Message` (
	`ID` int NOT NULL,
	`code` varchar(50) NULL,
	`message` text  NULL,
	`receive_group` int NULL,
	`created_at` timestamp  NOT NULL,
	PRIMARY KEY (`ID`)
);

-- Insert 0 entries into UMS_Message


DROP TABLE IF EXISTS `UMS_LDAPStaging`;

CREATE TABLE `UMS_LDAPStaging` (
	`ID` int NOT NULL,
	`CN` varchar(150) NULL,
	`GECOS` varchar(150) NULL,
	`GIDNUMBER` varchar(20) NULL,
	`HOMEDIRECTORY` varchar(150) NULL,
	`LOGINSHELL` varchar(150) NULL,
	`OBJECTCLASS` text  NULL,
	`SHADOWLASTCHANGE` varchar(50) NULL,
	`SHADOWMAX` varchar(50) NULL,
	`SHADOWWARNING` varchar(50) NULL,
	`UID` varchar(50) NULL,
	`UIDNUMBER` varchar(20) NULL,
	`USERPASSWORD` text  NULL,
	PRIMARY KEY (`ID`)
);

-- Insert 0 entries into UMS_LDAPStaging


DROP TABLE IF EXISTS `UMS_OperatingSession`;

CREATE TABLE `UMS_OperatingSession` (
	`ID` int NOT NULL,
	`userID` varchar(50) NULL,
	`adminID` varchar(50) NULL,
	`ticketID` int NULL,
	`msgTextOrBinary` text  NULL,
	`created_at` timestamp  NOT NULL,
	PRIMARY KEY (`ID`)
);

-- Insert 0 entries into UMS_OperatingSession


DROP TABLE IF EXISTS `UMS_OperatingTicket`;

CREATE TABLE `UMS_OperatingTicket` (
	`ID` int NOT NULL,
	`code` varchar(50) NULL,
	`remark` text  NULL,
	`created_at` timestamp  NOT NULL,
	PRIMARY KEY (`ID`)
);

-- Insert 0 entries into UMS_OperatingTicket


DROP TABLE IF EXISTS `UMS_Site`;

CREATE TABLE `UMS_Site` (
	`id` int NOT NULL,
	`code` varchar(20) NOT NULL,
	`name` varchar(100) NULL,
	`description` text  NULL,
	`address` varchar(300) NULL,
	`ipaddr` varchar(15) NOT NULL,
	`updated_at` timestamp  NOT NULL,
	`amgmtid` int NULL,
	PRIMARY KEY (`id`)
);

-- Insert 0 entries into UMS_Site


DROP TABLE IF EXISTS `UMS_SourceGroup`;

CREATE TABLE `UMS_SourceGroup` (
	`id` int NOT NULL,
	`name` varchar(100) NULL,
	`description` text  NULL,
	PRIMARY KEY (`id`)
);

-- Insert 0 entries into UMS_SourceGroup


DROP TABLE IF EXISTS `UMS_WarningMsg`;

CREATE TABLE `UMS_WarningMsg` (
	`id` int NOT NULL,
	`message` varchar(150) NULL,
	`detail` text  NULL,
	`warning_type` int NULL,
	`start_date` date  NULL,
	`end_date` date  NULL,
	`created_at` timestamp  NOT NULL,
	PRIMARY KEY (`id`)
);

-- Insert 0 entries into UMS_WarningMsg


DROP TABLE IF EXISTS `UMS_WarningType`;

CREATE TABLE `UMS_WarningType` (
	`id` int NOT NULL,
	`name` varchar(150) NULL,
	`updated_at` timestamp  NOT NULL,
	PRIMARY KEY (`id`)
);

-- Insert 0 entries into UMS_WarningType


DROP TABLE IF EXISTS `UMS_DeviceMon`;

CREATE TABLE `UMS_DeviceMon` (
	`id` int NOT NULL,
	`status` bit  NULL,
	`mac` varchar(50) NULL,
	`created_at` timestamp  NOT NULL,
	PRIMARY KEY (`id`)
);

-- Insert 0 entries into UMS_DeviceMon


DROP TABLE IF EXISTS `UMS_UserMon`;

CREATE TABLE `UMS_UserMon` (
	`id` int NOT NULL,
	`status` bit  NULL,
	`userId` varchar(50) NULL,
	`created_at` timestamp  NOT NULL,
	PRIMARY KEY (`id`)
);

-- Insert 0 entries into UMS_UserMon
