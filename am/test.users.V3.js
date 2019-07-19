const mLogger = require('../helpers/logger.js').log4js.getLogger('test/test.users.V2');
console.log = mLogger.info.bind(mLogger);
const Request = require('supertest')
const Assert = require('assert');
const mServer = require('../bin/www');
const mAgent = Request('http://localhost:3000');
const Response = require('../models/Response.js');
const sequelize = require('../models/database/models').sequelize;
const sinon = require('sinon');
const moment = require('moment');

describe('Test users', function () {
    const TOKEN_RESULT = {
        "base_info":
            {
                "accountId": 40001001,
                "agree": false,
                "birthday": "",
                "company": "",
                "email": "",
                "head_image_url": "",
                "home": "",
                "nickname": "",
                "phone": "0903430041",
                "referral_code": "QWQPYB",
                "sex": 0,
                "true_name": "",
                "wwid": "fetnix.test0"
            },
        "err_code":0,
        "origin":"service-activation-management",
        "token":"231559b6fccb7404bb5f95987b3bd92d"
    };
    const VOUCHER = {
        friday: {
            id: 'music000',
            type: 'music',
            name: 'Friday音樂免費服務一年'
        },
        fridayKkbox: {
            id: 'music001',
            type: 'music',
            name: 'Friday/KKBOX音樂服務免費兩個月'
        }
    };

    const PACKAGE_FRIDAY = {
        id: 'PACKAGE0000000000000',
        name: '測試基礎服務包(Friday)',
        description: '包含基礎服務和Friday音樂',
        voucherId: VOUCHER.friday.id
    };

    const PACKAGE_FRIDAY_KKBOX = {
        id: 'PACKAGE1111111111111',
        name: '測試基礎服務包(KKBOX)',
        description: '包含基礎服務和Friday/KKBOX音樂',
        voucherId: VOUCHER.fridayKkbox.id
    };

    const SERVICE_SSC = {
        sdpProductId: 'SSC0003',
        sdpPartnerId: 'PARTNER0001',
        productName: '基礎語音歡樂包'
    };

    const SERVICE_FMVC = {
        sdpProductId: 'FMVC0003',
        sdpPartnerId: 'PARTNER0002',
        productName: 'Friday音樂歡樂包',
        alias: 'music-Friday'
    };

    const SERVICE_KKBOX = {
        sdpProductId: 'KKBOX0003',
        sdpPartnerId: 'PARTNER0003',
        productName: 'KKBOX音樂歡樂包',
        alias: 'music-kkbox'
    };

    const CONTENT_REDEEMESERVICE_KKBOX = {
        redeemedService: 'music-kkbox'
    };

    const CONTENT_REDEEMESERVICE_FMVC = {
        redeemedService: 'music-Friday'
    };

    const DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST = {
        deviceId: 'default-000000000000000001',
        macAddr: 'BB:BB:BB:BB:BB:BB',
        partNo: 'Speaker',
        serialNo: 'H5222T2222',
        modelName: 'Tichome',
        deviceCatgId: 'device001',
        currentUserId: 'fetnix.test',
        packageId: PACKAGE_FRIDAY.id
    };

    const DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST2 = {
        deviceId: 'default-000000000000000002',
        macAddr: 'BB:BB:BB:BB:BB:CC',
        partNo: 'Speaker',
        serialNo: 'H5222T3333',
        modelName: 'TichomeMini2',
        deviceCatgId: 'device001',
        currentUserId: 'fetnix.test2',
        packageId: PACKAGE_FRIDAY_KKBOX.id
    };

    const DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_1 = {
        deviceId: 'default-000000000000000031',
        macAddr: 'BB:BB:BB:BB:BB:DD',
        partNo: 'Speaker',
        serialNo: 'H5333T1111',
        modelName: 'Tichome',
        deviceCatgId: 'device001',
        currentUserId: 'fetnix.test3',
        packageId: PACKAGE_FRIDAY.id
    };

    const DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_2 = {
        deviceId: 'default-000000000000000032',
        macAddr: 'BB:BB:BB:BB:BB:EE',
        partNo: 'Speaker',
        serialNo: 'H5333T2222',
        modelName: 'TichomeMini2',
        deviceCatgId: 'device001',
        currentUserId: 'fetnix.test3',
        packageId: PACKAGE_FRIDAY_KKBOX.id
    };

    const DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST4 = {
        deviceId: 'default-000000000000000004',
        macAddr: 'BB:BB:BB:BB:BB:FF',
        partNo: 'Speaker',
        serialNo: 'H5444T1111',
        modelName: 'TichomeMini2',
        deviceCatgId: 'device001',
        currentUserId: 'fetnix.test4',
        packageId: PACKAGE_FRIDAY_KKBOX.id
    };

    const DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST5_1 = {
        deviceId: 'default-000000000000000051',
        macAddr: 'BB:BB:BB:BB:BB:GG',
        partNo: 'Speaker',
        serialNo: 'H5555T1111',
        modelName: 'Tichome',
        deviceCatgId: 'device001',
        currentUserId: 'fetnix.test5',
        packageId: PACKAGE_FRIDAY.id
    };

    const DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST5_2 = {
        deviceId: 'default-000000000000000052',
        macAddr: 'BB:BB:BB:BB:BB:HH',
        partNo: 'Speaker',
        serialNo: 'H5555T2222',
        modelName: 'TichomeMini2',
        deviceCatgId: 'device001',
        currentUserId: 'fetnix.test5',
        packageId: PACKAGE_FRIDAY_KKBOX.id
    };

    const DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST6_1 = {
        deviceId: 'default-000000000000000061',
        macAddr: 'BB:BB:BB:BB:BB:II',
        partNo: 'Speaker',
        serialNo: 'H6666T1111',
        modelName: 'Tichome',
        deviceCatgId: 'device001',
        currentUserId: 'fetnix.test6',
        packageId: PACKAGE_FRIDAY.id
    };

    const DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST6_2 = {
        deviceId: 'default-000000000000000062',
        macAddr: 'BB:BB:BB:BB:BB:JJ',
        partNo: 'Speaker',
        serialNo: 'H6666T2222',
        modelName: 'TichomeMini2',
        deviceCatgId: 'device001',
        currentUserId: 'fetnix.test6',
        packageId: PACKAGE_FRIDAY_KKBOX.id
    };

    const USER_VOUCHER_FOR_FETNIX_TEST = {
        code: 'AAOfFbdg58-11',
        userId: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST.currentUserId,
        deviceSerialNo: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST.serialNo,
        voucherId: PACKAGE_FRIDAY.voucherId,
        packageId: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST.packageId,
        status: 0
    };

    const USER_VOUCHER_FOR_FETNIX_TEST2 = {
        code: 'BBOfFbdg58-11',
        userId: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST2.currentUserId,
        deviceSerialNo: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST2.serialNo,
        voucherId: PACKAGE_FRIDAY_KKBOX.voucherId,
        packageId: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST2.packageId,
        status: 0
    };

    const USER_VOUCHER_FOR_FETNIX_TEST_3_1 = {
        code: 'CCOfFbdg58-11',
        userId: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_1.currentUserId,
        deviceSerialNo: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_1.serialNo,
        voucherId: PACKAGE_FRIDAY.voucherId,
        packageId: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_1.packageId,
        status: 0
    };

    const USER_VOUCHER_FOR_FETNIX_TEST_3_2 = {
        code: 'DDOfFbdg58-11',
        userId: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_2.currentUserId,
        deviceSerialNo: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_2.serialNo,
        voucherId: PACKAGE_FRIDAY_KKBOX.voucherId,
        packageId: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_2.packageId,
        status: 0
    };

    const USER_VOUCHER_FOR_FETNIX_TEST_4 = {
        code: 'EEOfFbdg58-11',
        userId: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST4.currentUserId,
        deviceSerialNo: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST4.serialNo,
        voucherId: PACKAGE_FRIDAY_KKBOX.voucherId,
        packageId: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST4.packageId,
        status: 1,
        redeemedService: CONTENT_REDEEMESERVICE_KKBOX.redeemedService
    };

    const USER_VOUCHER_FOR_FETNIX_TEST_5_1 = {
        code: 'FFOfFbdg58-11',
        userId: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST5_1.currentUserId,
        deviceSerialNo: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST5_1.serialNo,
        voucherId: PACKAGE_FRIDAY.voucherId,
        packageId: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST5_1.packageId,
        status: 0
    };

    const USER_VOUCHER_FOR_FETNIX_TEST_5_2 = {
        code: 'GGOfFbdg58-11',
        userId: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST5_2.currentUserId,
        deviceSerialNo: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST5_2.serialNo,
        voucherId: PACKAGE_FRIDAY_KKBOX.voucherId,
        packageId: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST5_2.packageId,
        status: 1,
        redeemedService: CONTENT_REDEEMESERVICE_FMVC.redeemedService
    };

    const USER_VOUCHER_FOR_FETNIX_TEST_6_1 = {
        code: 'HHOfFbdg58-11',
        userId: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST6_1.currentUserId,
        deviceSerialNo: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST6_1.serialNo,
        voucherId: PACKAGE_FRIDAY.voucherId,
        packageId: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST6_1.packageId,
        status: 0
    };

    const USER_VOUCHER_FOR_FETNIX_TEST_6_2 = {
        code: 'IIOfFbdg58-11',
        userId: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST6_2.currentUserId,
        deviceSerialNo: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST6_2.serialNo,
        voucherId: PACKAGE_FRIDAY_KKBOX.voucherId,
        packageId: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST6_2.packageId,
        status: 1,
        redeemedService: CONTENT_REDEEMESERVICE_FMVC.redeemedService, 
        redeemedDate: '2019-01-01 12:00:00'
    };


    


    describe('Test user service', function () {
        before(function (done) {
            // Generate test data
            mLogger.info('Generate test data...');
            const SQL_FOR_PACKAGE = `INSERT INTO packages (packageId, packageName, description) VALUES ('${PACKAGE_FRIDAY.id}', '${PACKAGE_FRIDAY.name}','${PACKAGE_FRIDAY.description}'), ('${PACKAGE_FRIDAY_KKBOX.id}', '${PACKAGE_FRIDAY_KKBOX.name}','${PACKAGE_FRIDAY_KKBOX.description}');`;
            const SQL_FOR_SERVICE = `INSERT INTO services (sdpProductId, sdpPartnerId, productName) VALUES ('${SERVICE_SSC.sdpProductId}', '${SERVICE_SSC.sdpPartnerId}', '${SERVICE_SSC.productName}'), ('${SERVICE_FMVC.sdpProductId}', '${SERVICE_FMVC.sdpPartnerId}', '${SERVICE_FMVC.productName}'), ('${SERVICE_KKBOX.sdpProductId}', '${SERVICE_KKBOX.sdpPartnerId}', '${SERVICE_KKBOX.productName}');`;
            const SQL_FOR_PACKAGE_SERVICE = `INSERT INTO package_service (packageId, sdpProductId, necessary, alias) VALUES ('${PACKAGE_FRIDAY.id}', '${SERVICE_SSC.sdpProductId}', 1, '${SERVICE_FMVC.alias}'), ('${PACKAGE_FRIDAY.id}', '${SERVICE_FMVC.sdpProductId}', 0, '${SERVICE_FMVC.alias}'), ('${PACKAGE_FRIDAY_KKBOX.id}', '${SERVICE_SSC.sdpProductId}', 1, 'NULL'), ('${PACKAGE_FRIDAY_KKBOX.id}', '${SERVICE_FMVC.sdpProductId}', 0, '${SERVICE_FMVC.alias}'), ('${PACKAGE_FRIDAY_KKBOX.id}', '${SERVICE_KKBOX.sdpProductId}', 0, '${SERVICE_KKBOX.alias}');`;
            const SQL_FOR_DEVICE_TEST = `INSERT INTO devices (deviceId, macAddr, partNo, serialNo, modelName, deviceCatgId, packageId, currentUserId) VALUES ('${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST.deviceId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST.macAddr}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST.partNo}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST.serialNo}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST.modelName}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST.deviceCatgId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST.packageId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST.currentUserId}');`;
            const SQL_FOR_DEVICE_TEST2 = `INSERT INTO devices (deviceId, macAddr, partNo, serialNo, modelName, deviceCatgId, packageId, currentUserId) VALUES ('${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST2.deviceId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST2.macAddr}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST2.partNo}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST2.serialNo}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST2.modelName}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST2.deviceCatgId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST2.packageId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST2.currentUserId}');`;
            const SQL_FOR_DEVICE_TEST3_1 = `INSERT INTO devices (deviceId, macAddr, partNo, serialNo, modelName, deviceCatgId, packageId, currentUserId) VALUES ('${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_1.deviceId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_1.macAddr}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_1.partNo}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_1.serialNo}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_1.modelName}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_1.deviceCatgId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_1.packageId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_1.currentUserId}');`;
            const SQL_FOR_DEVICE_TEST3_2 = `INSERT INTO devices (deviceId, macAddr, partNo, serialNo, modelName, deviceCatgId, packageId, currentUserId) VALUES ('${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_2.deviceId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_2.macAddr}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_2.partNo}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_2.serialNo}',  '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_2.modelName}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_2.deviceCatgId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_2.packageId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_2.currentUserId}');`;
            const SQL_FOR_DEVICE_TEST4 = `INSERT INTO devices (deviceId, macAddr, partNo, serialNo, modelName, deviceCatgId, packageId, currentUserId) VALUES ('${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST4.deviceId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST4.macAddr}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST4.partNo}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST4.serialNo}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST4.modelName}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST4.deviceCatgId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST4.packageId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_2.currentUserId}');`;
            const SQL_FOR_DEVICE_TEST5_1 = `INSERT INTO devices (deviceId, macAddr, partNo, serialNo, modelName, deviceCatgId, packageId, currentUserId) VALUES ('${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST5_1.deviceId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST5_1.macAddr}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST5_1.partNo}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST5_1.serialNo}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST5_1.modelName}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST5_1.deviceCatgId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST5_1.packageId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_2.currentUserId}');`;
            const SQL_FOR_DEVICE_TEST5_2 = `INSERT INTO devices (deviceId, macAddr, partNo, serialNo, modelName, deviceCatgId, packageId, currentUserId) VALUES ('${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST5_2.deviceId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST5_2.macAddr}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST5_2.partNo}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST5_2.serialNo}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST5_2.modelName}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST5_2.deviceCatgId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST5_2.packageId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_2.currentUserId}');`;
            const SQL_FOR_DEVICE_TEST6_1 = `INSERT INTO devices (deviceId, macAddr, partNo, serialNo, modelName, deviceCatgId, packageId, currentUserId) VALUES ('${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST6_1.deviceId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST6_1.macAddr}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST6_1.partNo}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST6_1.serialNo}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST6_1.modelName}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST6_1.deviceCatgId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST6_1.packageId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_2.currentUserId}');`;
            const SQL_FOR_DEVICE_TEST6_2 = `INSERT INTO devices (deviceId, macAddr, partNo, serialNo, modelName, deviceCatgId, packageId, currentUserId) VALUES ('${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST6_2.deviceId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST6_2.macAddr}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST6_2.partNo}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST6_2.serialNo}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST6_2.modelName}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST6_2.deviceCatgId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST6_2.packageId}', '${DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_2.currentUserId}');`;
            const SQL_FOR_VOUCHER = `INSERT INTO vouchers (voucherId, type, name) VALUES ('${VOUCHER.friday.id}', '${VOUCHER.friday.type}', '${VOUCHER.friday.name}'), ('${VOUCHER.fridayKkbox.id}', '${VOUCHER.fridayKkbox.type}', '${VOUCHER.fridayKkbox.name}');`;
            const SQL_FOR_PACKAGE_VOUCHER = `INSERT INTO package_voucher (packageId, voucherId) VALUES ('${PACKAGE_FRIDAY.id}', '${PACKAGE_FRIDAY.voucherId}'), ('${PACKAGE_FRIDAY_KKBOX.id}', '${PACKAGE_FRIDAY_KKBOX.voucherId}');`;
            const SQL_FOR_USER_VOUCHER = `INSERT INTO user_voucher (code, userId, deviceSerialNo, voucherId, packageId, status) VALUES ('${USER_VOUCHER_FOR_FETNIX_TEST.code}', '${USER_VOUCHER_FOR_FETNIX_TEST.userId}', '${USER_VOUCHER_FOR_FETNIX_TEST.deviceSerialNo}', '${USER_VOUCHER_FOR_FETNIX_TEST.voucherId}', '${USER_VOUCHER_FOR_FETNIX_TEST.packageId}', '${USER_VOUCHER_FOR_FETNIX_TEST.status}');`;
            const SQL_FOR_USER_VOUCHER_2 = `INSERT INTO user_voucher (code, userId, deviceSerialNo, voucherId, packageId, status) VALUES ('${USER_VOUCHER_FOR_FETNIX_TEST2.code}', '${USER_VOUCHER_FOR_FETNIX_TEST2.userId}', '${USER_VOUCHER_FOR_FETNIX_TEST2.deviceSerialNo}', '${USER_VOUCHER_FOR_FETNIX_TEST2.voucherId}', '${USER_VOUCHER_FOR_FETNIX_TEST2.packageId}', '${USER_VOUCHER_FOR_FETNIX_TEST2.status}');`;
            const SQL_FOR_USER_VOUCHER_3_1 = `INSERT INTO user_voucher (code, userId, deviceSerialNo, voucherId, packageId, status) VALUES ('${USER_VOUCHER_FOR_FETNIX_TEST_3_1.code}', '${USER_VOUCHER_FOR_FETNIX_TEST_3_1.userId}', '${USER_VOUCHER_FOR_FETNIX_TEST_3_1.deviceSerialNo}', '${USER_VOUCHER_FOR_FETNIX_TEST_3_1.voucherId}', '${USER_VOUCHER_FOR_FETNIX_TEST_3_1.packageId}', '${USER_VOUCHER_FOR_FETNIX_TEST_3_1.status}');`;
            const SQL_FOR_USER_VOUCHER_3_2 = `INSERT INTO user_voucher (code, userId, deviceSerialNo, voucherId, packageId, status) VALUES ('${USER_VOUCHER_FOR_FETNIX_TEST_3_2.code}', '${USER_VOUCHER_FOR_FETNIX_TEST_3_2.userId}', '${USER_VOUCHER_FOR_FETNIX_TEST_3_2.deviceSerialNo}', '${USER_VOUCHER_FOR_FETNIX_TEST_3_2.voucherId}', '${USER_VOUCHER_FOR_FETNIX_TEST_3_2.packageId}', '${USER_VOUCHER_FOR_FETNIX_TEST_3_2.status}');`;
            const SQL_FOR_USER_VOUCHER_4 = `INSERT INTO user_voucher (code, userId, deviceSerialNo, voucherId, packageId, status, redeemedService) VALUES ('${USER_VOUCHER_FOR_FETNIX_TEST_4.code}', '${USER_VOUCHER_FOR_FETNIX_TEST_4.userId}', '${USER_VOUCHER_FOR_FETNIX_TEST_4.deviceSerialNo}', '${USER_VOUCHER_FOR_FETNIX_TEST_4.voucherId}', '${USER_VOUCHER_FOR_FETNIX_TEST_4.packageId}', '${USER_VOUCHER_FOR_FETNIX_TEST_4.status}', '${USER_VOUCHER_FOR_FETNIX_TEST_4.redeemedService}');`;
            const SQL_FOR_USER_VOUCHER_5_1 = `INSERT INTO user_voucher (code, userId, deviceSerialNo, voucherId, packageId, status) VALUES ('${USER_VOUCHER_FOR_FETNIX_TEST_5_1.code}', '${USER_VOUCHER_FOR_FETNIX_TEST_5_1.userId}', '${USER_VOUCHER_FOR_FETNIX_TEST_5_1.deviceSerialNo}', '${USER_VOUCHER_FOR_FETNIX_TEST_5_1.voucherId}', '${USER_VOUCHER_FOR_FETNIX_TEST_5_1.packageId}', '${USER_VOUCHER_FOR_FETNIX_TEST_5_1.status}');`;
            const SQL_FOR_USER_VOUCHER_5_2 = `INSERT INTO user_voucher (code, userId, deviceSerialNo, voucherId, packageId, status, redeemedService) VALUES ('${USER_VOUCHER_FOR_FETNIX_TEST_5_2.code}', '${USER_VOUCHER_FOR_FETNIX_TEST_5_2.userId}', '${USER_VOUCHER_FOR_FETNIX_TEST_5_2.deviceSerialNo}', '${USER_VOUCHER_FOR_FETNIX_TEST_5_2.voucherId}', '${USER_VOUCHER_FOR_FETNIX_TEST_5_2.packageId}', '${USER_VOUCHER_FOR_FETNIX_TEST_5_2.status}', '${USER_VOUCHER_FOR_FETNIX_TEST_5_2.redeemedService}');`;           
            const SQL_FOR_USER_VOUCHER_6_1 = `INSERT INTO user_voucher (code, userId, deviceSerialNo, voucherId, packageId, status) VALUES ('${USER_VOUCHER_FOR_FETNIX_TEST_6_1.code}', '${USER_VOUCHER_FOR_FETNIX_TEST_6_1.userId}', '${USER_VOUCHER_FOR_FETNIX_TEST_6_1.deviceSerialNo}', '${USER_VOUCHER_FOR_FETNIX_TEST_6_1.voucherId}', '${USER_VOUCHER_FOR_FETNIX_TEST_6_1.packageId}', '${USER_VOUCHER_FOR_FETNIX_TEST_6_1.status}');`;
            const SQL_FOR_USER_VOUCHER_6_2 = `INSERT INTO user_voucher (code, userId, deviceSerialNo, voucherId, packageId, status, redeemedService, updatedAt) VALUES ('${USER_VOUCHER_FOR_FETNIX_TEST_6_2.code}', '${USER_VOUCHER_FOR_FETNIX_TEST_6_2.userId}', '${USER_VOUCHER_FOR_FETNIX_TEST_6_2.deviceSerialNo}', '${USER_VOUCHER_FOR_FETNIX_TEST_6_2.voucherId}', '${USER_VOUCHER_FOR_FETNIX_TEST_6_2.packageId}', '${USER_VOUCHER_FOR_FETNIX_TEST_6_2.status}', '${USER_VOUCHER_FOR_FETNIX_TEST_6_2.redeemedService}', '${USER_VOUCHER_FOR_FETNIX_TEST_6_2.redeemedDate}');`;
            
            const CREATE_TEST_DATA = [
                SQL_FOR_PACKAGE,
                SQL_FOR_SERVICE,
                SQL_FOR_VOUCHER,
                SQL_FOR_DEVICE_TEST,
                SQL_FOR_DEVICE_TEST2,
                SQL_FOR_DEVICE_TEST3_1,
                SQL_FOR_DEVICE_TEST3_2,
                SQL_FOR_DEVICE_TEST4,
                SQL_FOR_DEVICE_TEST5_1,
                SQL_FOR_DEVICE_TEST5_2,
                SQL_FOR_DEVICE_TEST6_1,
                SQL_FOR_DEVICE_TEST6_2
            ].join(' ');
            const CREATE_TEST_DATA_2 = [
                SQL_FOR_PACKAGE_SERVICE,
                SQL_FOR_PACKAGE_VOUCHER,
                SQL_FOR_USER_VOUCHER,
                SQL_FOR_USER_VOUCHER_2,
                SQL_FOR_USER_VOUCHER_3_1,
                SQL_FOR_USER_VOUCHER_3_2,
                SQL_FOR_USER_VOUCHER_4,
                SQL_FOR_USER_VOUCHER_5_1,
                SQL_FOR_USER_VOUCHER_5_2,
                SQL_FOR_USER_VOUCHER_6_1,
                SQL_FOR_USER_VOUCHER_6_2
            ].join(' ');

            sequelize.query(CREATE_TEST_DATA)
                .then(myTableRows => {
                    sequelize.query(CREATE_TEST_DATA_2)
                    .then(myTableRows => {
                        mLogger.info(myTableRows);
                        done();
                    });
                });
        });

        after(function (done) {
            // Clear test data
            mLogger.info('Clear test data...');
            const SQL_FOR_DELETE_DEVICE = `DELETE FROM devices WHERE 1=1;`;
            const SQL_FOR_DELETE_SERVICE = `DELETE FROM services WHERE 1=1;`;
            const SQL_FOR_DELETE_PACKAGE = `DELETE FROM packages WHERE 1=1;`;
            const SQL_FOR_DELETE_PACKAGE_SRVICE = `DELETE FROM package_service WHERE 1=1;`;
            const SQL_FOR_DELETE_RECORD = `Truncate records;`;
            const SQL_FOR_DELETE_DEVICE_RIGHTS = `Truncate devices_dispatched_rights;`;
            const SQL_FOR_DELETE_VOUCHER = `DELETE FROM vouchers WHERE 1=1;`;
            const SQL_FOR_DELETE_PACKAGE_VOUCHER = `Truncate package_voucher;`
            const SQL_FOR_DELETE_USER_VOUCHER = `Truncate user_voucher;`;

            const CLEAR_TEST_DATA = [
                SQL_FOR_DELETE_PACKAGE_VOUCHER,
                SQL_FOR_DELETE_USER_VOUCHER,
                SQL_FOR_DELETE_DEVICE,
                SQL_FOR_DELETE_PACKAGE_SRVICE,
                SQL_FOR_DELETE_SERVICE,
                SQL_FOR_DELETE_PACKAGE,
                SQL_FOR_DELETE_RECORD,
                SQL_FOR_DELETE_DEVICE_RIGHTS,
                SQL_FOR_DELETE_VOUCHER
            ].join(' ');
            sequelize.query(CLEAR_TEST_DATA)
                .then(myTableRows => {
                    mLogger.info('Clear test data completely.');
                    done();
                });
        });

        describe('Test get voucher', function () {
            var umClient;
            var expect = new Response();
            before(function (done) {
                umClient = require('../src/client/umClient');
                sinon.stub(umClient, 'getUserInfoByToken').callsFake(function () {
                    return TOKEN_RESULT;
                });
                done();
            });
            after(function (done) {
                umClient.getUserInfoByToken.restore();
                done();
            });
            it('[2-1 get voucher] should be response []', function (done) {
                mAgent
                    .get('/api/am/v2/users/vouchers')
                    .set('token', '231559b6fccb7404bb5f95987b3bd92d')
                    .end(function(err, res) {
                        if (err) return done(err);
                        mLogger.debug(res.text);
                        Assert.strictEqual(JSON.parse(res.text).errCode, expect.success().errCode);
                        Assert.deepStrictEqual(JSON.parse(res.text).vouchers, []);
                        done();
                    });
            });
        });

        /**
         * fetnix.test有1張未領用 Friday音樂免費服務一年兌換券
         * Expect result:
         *  code: AAOfFbdg58-11
         *  status: 0
         *  deviceSerialNo: H5222T2222
         *  deviceModelName: Tichome
         *  provider: music-Friday
         *  name: Friday音樂免費服務一年
         *  description: ''
         */
        describe('Test get voucher', function () {
            var expect = new Response();
            var umClient;
            before(function (done) {
                umClient = require('../src/client/umClient');
                const TOKEN_RESULT_FOR_TEST = JSON.parse(JSON.stringify(TOKEN_RESULT));
                TOKEN_RESULT_FOR_TEST.base_info.wwid = 'fetnix.test';
                sinon.stub(umClient, 'getUserInfoByToken').callsFake(function () {
                    return TOKEN_RESULT_FOR_TEST;
                });
                done();
            });
            after(function (done) {
                umClient.getUserInfoByToken.restore();
                done();
            });
            it('[2-2 get voucher] should be response vouchers', function (done) {
                mAgent
                    .get('/api/am/v2/users/vouchers')
                    .set('token', '231559b6fccb7404bb5f95987b3bd92d')
                    .end(function(err, res) {
                        if (err) return done(err);
                        mLogger.debug(res.text);
                        Assert.strictEqual(JSON.parse(res.text).errCode, expect.success().errCode);
                        Assert.deepStrictEqual(JSON.parse(res.text).vouchers, [{
                            code: USER_VOUCHER_FOR_FETNIX_TEST.code,
                            status: USER_VOUCHER_FOR_FETNIX_TEST.status,
                            deviceSerialNo: USER_VOUCHER_FOR_FETNIX_TEST.deviceSerialNo,
                            deviceModelName: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST.modelName,
                            provider: ['music-Friday'],
                            name: VOUCHER.friday.name,
                            description: '',
                            redeemedService: '',
                            redeemedDate: ''
                        }]);
                        done();
                    });
            });
            it('[2-2-2 get voucher by cipher] should be response vouchers', function (done) {
                mAgent
                    .get('/api/am/v2/users/vouchers')
                    .set('cipher', 'id1nzVFh9707NCekI48MFw==') // fetnix.test0
                    .end(function(err, res) {
                        if (err) return done(err);
                        mLogger.debug(res.text);
                        Assert.strictEqual(JSON.parse(res.text).errCode, expect.success().errCode);
                        Assert.deepStrictEqual(JSON.parse(res.text).vouchers, [{
                            code: USER_VOUCHER_FOR_FETNIX_TEST.code,
                            status: USER_VOUCHER_FOR_FETNIX_TEST.status,
                            deviceSerialNo: USER_VOUCHER_FOR_FETNIX_TEST.deviceSerialNo,
                            deviceModelName: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST.modelName,
                            provider: ['music-Friday'],
                            name: VOUCHER.friday.name,
                            description: '',
                            redeemedService: '',
                            redeemedDate: ''
                        }]);
                        done();
                    });
            });
        });
        /**
         * fetnix.test2有1張未領用 Friday/KKBOX音樂服務免費兩個月
         * Expect result:
         *  code: BBOfFbdg58-11
         *  status: 0
         *  deviceSerialNo: H5222T3333
         *  deviceModelName: Tichome
         *  provider: music-Friday, music-kkbox
         *  name: Friday/KKBOX音樂服務免費兩個月
         *  description: ''
         */
        describe('Test get voucher', function () {
            var expect = new Response();
            var umClient;
            before(function (done) {
                umClient = require('../src/client/umClient');
                const TOKEN_RESULT_FOR_TEST = JSON.parse(JSON.stringify(TOKEN_RESULT));
                TOKEN_RESULT_FOR_TEST.base_info.wwid = 'fetnix.test2';
                sinon.stub(umClient, 'getUserInfoByToken').callsFake(function () {
                    return TOKEN_RESULT_FOR_TEST;
                });
                done();
            });
            after(function (done) {
                umClient.getUserInfoByToken.restore();
                done();
            });
            it('[2-3 get voucher] should be response vouchers', function (done) {
                mAgent
                    .get('/api/am/v2/users/vouchers')
                    .set('token', '231559b6fccb7404bb5f95987b3bd92d')
                    .end(function(err, res) {
                        if (err) return done(err);
                        mLogger.debug(res.text);
                        Assert.strictEqual(JSON.parse(res.text).errCode, expect.success().errCode);
                        Assert.deepStrictEqual(JSON.parse(res.text).vouchers, [{
                            code: USER_VOUCHER_FOR_FETNIX_TEST2.code,
                            status: USER_VOUCHER_FOR_FETNIX_TEST2.status,
                            deviceSerialNo: USER_VOUCHER_FOR_FETNIX_TEST2.deviceSerialNo,
                            deviceModelName: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST2.modelName,
                            provider: ['music-Friday', 'music-kkbox'],
                            name: VOUCHER.fridayKkbox.name,
                            description: '',
                            redeemedService: '',
                            redeemedDate: ''
                        }]);
                        done();
                    });
            });
        });
        /**
         * fetnix.test3有1張未領用 Friday音樂免費服務一年兌換券 和 1張未領用 Friday/KKBOX音樂服務免費兩個月
         * Expect result:
         *  code: CCOfFbdg58-11
         *  status: 0
         *  deviceSerialNo: H5333T1111
         *  deviceModelName: Tichome
         *  provider: music-Friday
         *  name: Friday音樂免費服務一年兌換券
         *  description: ''
         *
         *  code: DDOfFbdg58-11
         *  status: 0
         *  deviceSerialNo: H5333T2222
         *  deviceModelName: Tichome
         *  provider: music-Friday, music-kkbox
         *  name: Friday/KKBOX音樂服務免費兩個月
         *  description: ''
         */
        describe('Test get voucher', function () {
            var expect = new Response();
            var umClient;
            before(function (done) {
                umClient = require('../src/client/umClient');
                const TOKEN_RESULT_FOR_TEST = JSON.parse(JSON.stringify(TOKEN_RESULT));
                TOKEN_RESULT_FOR_TEST.base_info.wwid = 'fetnix.test3';
                sinon.stub(umClient, 'getUserInfoByToken').callsFake(function () {
                    return TOKEN_RESULT_FOR_TEST;
                });
                done();
            });
            after(function (done) {
                umClient.getUserInfoByToken.restore();
                done();
            });
            it('[2-4 get voucher] should be response vouchers', function (done) {
                mAgent
                    .get('/api/am/v2/users/vouchers')
                    .set('token', '231559b6fccb7404bb5f95987b3bd92d')
                    .end(function(err, res) {
                        if (err) return done(err);
                        mLogger.debug(res.text);
                        Assert.strictEqual(JSON.parse(res.text).errCode, expect.success().errCode);
                        Assert.deepStrictEqual(JSON.parse(res.text).vouchers, [{
                            code: USER_VOUCHER_FOR_FETNIX_TEST_3_1.code,
                            status: USER_VOUCHER_FOR_FETNIX_TEST_3_1.status,
                            deviceSerialNo: USER_VOUCHER_FOR_FETNIX_TEST_3_1.deviceSerialNo,
                            deviceModelName: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_1.modelName,
                            provider: ['music-Friday'],
                            name: VOUCHER.friday.name,
                            description: '',
                            redeemedService: '',
                            redeemedDate: ''
                        },
                        {
                            code: USER_VOUCHER_FOR_FETNIX_TEST_3_2.code,
                            status: USER_VOUCHER_FOR_FETNIX_TEST_3_2.status,
                            deviceSerialNo: USER_VOUCHER_FOR_FETNIX_TEST_3_2.deviceSerialNo,
                            deviceModelName: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST3_2.modelName,
                            provider: ['music-Friday', 'music-kkbox'],
                            name: VOUCHER.fridayKkbox.name,
                            description: '',
                            redeemedService: '',
                            redeemedDate: ''
                        }]);
                        done();
                    });
            });
        });
        /**
         * fetnix.test4有1張領用 Friday/KKBOX音樂服務免費兩個月
         * Expect result:
         *  code: EEOfFbdg58-11
         *  status: 1
         *  deviceSerialNo: H5444T1111
         *  deviceModelName: TichomeMini2
         *  provider: music-Friday, music-kkbox
         *  name: Friday / KKBOX音樂服務免費兩個月
         *  description: ''
         */
        describe('Test get voucher', function () {
            var expect = new Response();
            var umClient;
            before(function (done) {
                umClient = require('../src/client/umClient');
                const TOKEN_RESULT_FOR_TEST = JSON.parse(JSON.stringify(TOKEN_RESULT));
                TOKEN_RESULT_FOR_TEST.base_info.wwid = 'fetnix.test4';
                sinon.stub(umClient, 'getUserInfoByToken').callsFake(function () {
                    return TOKEN_RESULT_FOR_TEST;
                });
                done();
            });
            after(function (done) {
                umClient.getUserInfoByToken.restore();
                done();
            });
            it('[2-4 get voucher] should be response vouchers', function (done) {
                mAgent
                    .get('/api/am/v2/users/vouchers')
                    .set('token', '231559b6fccb7404bb5f95987b3bd92d')
                    .end(function(err, res) {
                        if (err) return done(err);
                        mLogger.debug(res.text);
                        Assert.strictEqual(JSON.parse(res.text).errCode, expect.success().errCode);
                        Assert.deepStrictEqual(JSON.parse(res.text).vouchers, [{
                            code: USER_VOUCHER_FOR_FETNIX_TEST_4.code,
                            status: USER_VOUCHER_FOR_FETNIX_TEST_4.status,
                            deviceSerialNo: USER_VOUCHER_FOR_FETNIX_TEST_4.deviceSerialNo,
                            deviceModelName: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST4.modelName,
                            provider: ['music-Friday', 'music-kkbox'],
                            name: VOUCHER.fridayKkbox.name,
                            description: '',
                            redeemedService: USER_VOUCHER_FOR_FETNIX_TEST_4.redeemedService,
                            redeemedDate: ''
                        }]);
                        done();
                    });
            });
        });
        /**
         * fetnix.test5 有1張未領用 Friday音樂免費服務一年兌換券 和 1張領用 Friday/KKBOX音樂服務免費兩個月
         * Expect result:
         *  code: FFOfFbdg58-11
         *  status: 1
         *  deviceSerialNo: H5555T1111
         *  deviceModelName: Tichome
         *  provider: music-Friday
         *  name: Friday音樂免費服務一年兌換券
         *  description: ''
         *
         *  code: GGOfFbdg58-11
         *  status: 1
         *  deviceSerialNo: H5555T2222
         *  deviceModelName: Tichome
         *  provider: music-Friday, music-kkbox
         *  name: Friday/KKBOX音樂服務免費兩個月
         *  description: ''
         */
        describe('Test get voucher', function () {
            var expect = new Response();
            var umClient;
            before(function (done) {
                umClient = require('../src/client/umClient');
                const TOKEN_RESULT_FOR_TEST = JSON.parse(JSON.stringify(TOKEN_RESULT));
                TOKEN_RESULT_FOR_TEST.base_info.wwid = 'fetnix.test5';
                sinon.stub(umClient, 'getUserInfoByToken').callsFake(function () {
                    return TOKEN_RESULT_FOR_TEST;
                });
                done();
            });
            after(function (done) {
                umClient.getUserInfoByToken.restore();
                done();
            });
            it('[2-5 get voucher] should be response vouchers', function (done) {
                mAgent
                    .get('/api/am/v2/users/vouchers')
                    .set('token', '231559b6fccb7404bb5f95987b3bd92d')
                    .end(function(err, res) {
                        if (err) return done(err);
                        mLogger.debug(res.text);
                        Assert.strictEqual(JSON.parse(res.text).errCode, expect.success().errCode);
                        Assert.deepStrictEqual(JSON.parse(res.text).vouchers, [{
                            code: USER_VOUCHER_FOR_FETNIX_TEST_5_1.code,
                            status: USER_VOUCHER_FOR_FETNIX_TEST_5_1.status,
                            deviceSerialNo: USER_VOUCHER_FOR_FETNIX_TEST_5_1.deviceSerialNo,
                            deviceModelName: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST5_1.modelName,
                            provider: ['music-Friday'],
                            name: VOUCHER.friday.name,
                            description: '',
                            redeemedService: '',
                            redeemedDate: ''
                        },
                        {
                            code: USER_VOUCHER_FOR_FETNIX_TEST_5_2.code,
                            status: USER_VOUCHER_FOR_FETNIX_TEST_5_2.status,
                            deviceSerialNo: USER_VOUCHER_FOR_FETNIX_TEST_5_2.deviceSerialNo,
                            deviceModelName: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST5_2.modelName,
                            provider: ['music-Friday', 'music-kkbox'],
                            name: VOUCHER.fridayKkbox.name,
                            description: '',
                            redeemedService: USER_VOUCHER_FOR_FETNIX_TEST_5_2.redeemedService,
                            redeemedDate: ''
                        }]);
                        done();
                    });
            });
        });
        /**
         * fetnix.test6 有1張未領用 Friday音樂免費服務一年兌換券 和 1張領用 Friday/KKBOX音樂服務免費兩個月
         * Expect result:
         *  code: HHOfFbdg58-11
         *  status: 1
         *  deviceSerialNo: H6666T1111
         *  deviceModelName: Tichome
         *  provider: music-Friday
         *  name: Friday音樂免費服務一年兌換券
         *  description: ''
         *
         *  code: HHOfFbdg58-11
         *  status: 1
         *  deviceSerialNo: H6666T2222
         *  deviceModelName: Tichome
         *  provider: music-Friday, music-kkbox
         *  name: Friday/KKBOX音樂服務免費兩個月
         *  description: ''
         */
        describe('Test get voucher', function () {
            var expect = new Response();
            var umClient;
            before(function (done) {
                umClient = require('../src/client/umClient');
                const TOKEN_RESULT_FOR_TEST = JSON.parse(JSON.stringify(TOKEN_RESULT));
                TOKEN_RESULT_FOR_TEST.base_info.wwid = 'fetnix.test6';
                sinon.stub(umClient, 'getUserInfoByToken').callsFake(function () {
                    return TOKEN_RESULT_FOR_TEST;
                });
                done();
            });
            after(function (done) {
                umClient.getUserInfoByToken.restore();
                done();
            });
            it('[2-6 get voucher] should be response vouchers', function (done) {
                mAgent
                    .get('/api/am/v2/users/vouchers')
                    .set('token', '231559b6fccb7404bb5f95987b3bd92d')
                    .end(function(err, res) {
                        if (err) return done(err);
                        mLogger.debug(res.text);
                        Assert.strictEqual(JSON.parse(res.text).errCode, expect.success().errCode);
                        Assert.deepStrictEqual(JSON.parse(res.text).vouchers, [{
                            code: USER_VOUCHER_FOR_FETNIX_TEST_6_1.code,
                            status: USER_VOUCHER_FOR_FETNIX_TEST_6_1.status,
                            deviceSerialNo: USER_VOUCHER_FOR_FETNIX_TEST_6_1.deviceSerialNo,
                            deviceModelName: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_FOR_FETNIX_TEST6_1.modelName,
                            provider: ['music-Friday'],
                            name: VOUCHER.friday.name,
                            description: '',
                            redeemedService: '',
                            redeemedDate: ''
                        },
                        {
                            code: USER_VOUCHER_FOR_FETNIX_TEST_6_2.code,
                            status: USER_VOUCHER_FOR_FETNIX_TEST_6_2.status,
                            deviceSerialNo: USER_VOUCHER_FOR_FETNIX_TEST_6_2.deviceSerialNo,
                            deviceModelName: DEVICE_PACKAGE_WITH_PACKAGE_FRIDAY_KKBOX_FOR_FETNIX_TEST6_2.modelName,
                            provider: ['music-Friday', 'music-kkbox'],
                            name: VOUCHER.fridayKkbox.name,
                            description: '',
                            redeemedService: USER_VOUCHER_FOR_FETNIX_TEST_6_2.redeemedService,
                            redeemedDate: moment(USER_VOUCHER_FOR_FETNIX_TEST_6_2.redeemedDate).format('YYYY-MM-DD HH:mm:ss')
                        }]);
                        done();
                    });
            });
        });
    });
});
