var express = require('express');
var router = express.Router();
var routerV2 = express.Router();
var routerV3 = express.Router();
var Response = require('../models/Response.js')
var umClient = require('../src/client/umClient');
const mLogger = require('../helpers/logger.js').log4js.getLogger('usersHandler');
var userService = require('../src/app/user/userService');
var CSRCrypto = require('../models/CSRCrypto');
const t = require('tcomb-validation');

/* Start of router v1*/
router.use(async function (req, res, next) {
    mLogger.info('=== Receiving %s %s API call with request data: %O %j ===', req.method, req.originalUrl, req.headers, req.body||req.query);
    let response = new Response();
    if (!req.headers['token']) {
        let user = {
            "base_info": {
              "accountId": 40000216,
              "agree": false,
              "nickname": "FET_Ted_Lin",
              "phone": "0900000016",
              "referral_code": "LHREOX",
              "sex": 0,
              "wwid": "fetnix.1546843584657989"
            },
            "err_code": 0,
            "token": "982f9c687cf29581214e6573c87cc620"
        };
        if (user.base_info && user.base_info.wwid) {
            req.userId = user.base_info.wwid;
            return next('route');
        }
    } 
    // mLogger.info('=== Receiving %s %s API call with request data: %O %j ===', req.method, req.originalUrl, req.headers, req.body||req.query);
    // let response = new Response();
    // if (!req.headers['token']) return res.json(response.invalidRequest());
    // let user = await umClient.getUserInfoByToken(req.headers['token']);
    // if (user.base_info && user.base_info.wwid) {
    //     req.userId = user.base_info.wwid;
    //     return next('route');
    // }
    // return res.json(response.invalidToken());
});

/* GET 查詢使用者裝置贈送的音樂權益領取狀態. */
router.get('/vouchers', async function (req, res) {
    let response = new Response();
    let userVoucher;
    try {
        userVoucher = await userService.getUserVoucher(req.userId);
    } catch (error) {
        mLogger.error('Get vouchers occurred error %O', error);
        return res.json(response.internalServerError());
    }
    response.vouchers = userVoucher;
    res.json(response.success());
});

router.post('/redeem-voucher', async function (req, res) {
    let response = new Response();
    const VoucherInfo = t.struct({
        deviceSerialNo: t.String,
        voucherCode: t.String,
        provider: t.String,
    }, "DeviceInfo");
    const Validation = t.list(VoucherInfo);
    const result = t.validate(req.body, Validation);
    if (!result.isValid()) {
        response.errDetail = result.errors[0].message;
        return res.json([response.invalidRequest()]);
    }

    let redeem = await userService.redeem(req.userId, req.body);
    return res.json(redeem);
});
/* End for router v1 */

/* Below for routerV2: with csrPortal available */
routerV2.use(async function (req, res, next) {
    // mLogger.info('=== Receiving %s %s API call with request data: %O %j ===', req.method, req.originalUrl, req.headers, req.body||req.query);
    // let response = new Response();
    // if (!req.headers['token']) {
    //     let user = {
    //         "base_info": {
    //           "accountId": 40000216,
    //           "agree": false,
    //           "nickname": "FET_Ted_Lin",
    //           "phone": "0900000016",
    //           "referral_code": "LHREOX",
    //           "sex": 0,
    //           "wwid": "fetnix.1546843584657989"
    //         },
    //         "err_code": 0,
    //         "token": "982f9c687cf29581214e6573c87cc620"
    //     };
    //     if (user.base_info && user.base_info.wwid) {
    //         req.userId = user.base_info.wwid;
    //         return next('route');
    //     }
    // } 
    
    
    
    
    
    
    mLogger.info('=== Receiving %s %s API call with request data: %O %j ===', req.method, req.originalUrl, req.headers, req.body||req.query);
    let response = new Response();
    if (req.headers['token']) {
        mLogger.info('Request By token ' + req.headers['token']);
        let user = await umClient.getUserInfoByToken(req.headers['token']);
        if (user.base_info && user.base_info.wwid) {
            req.userId = user.base_info.wwid;
            return next('route');
        }
        return res.json(response.invalidToken());
    } else if (req.headers['cipher']) {
        mLogger.info('Request By cipher ' + req.headers['cipher']);
        let csrCrypto = new CSRCrypto();
        try {
            req.userId = csrCrypto.decrytion(req.headers['cipher']);
        } catch (error) {
            mLogger.error(error);
            return res.json(response.invalidRequest());
        }
        mLogger.info('descrypted userId = ' + req.userId);
        return next('route');
    } else {
        return res.json(response.invalidRequest());
    }
});

/* GET 查詢使用者裝置贈送的音樂權益領取狀態. */
routerV2.get('/vouchers', async function (req, res) {
    let response = new Response();
    let userVoucher;
    try {
        userVoucher = await userService.getUserVoucherV2(req.userId);
    } catch (error) {
        mLogger.error('Get vouchers occurred error %O', error);
        return res.json(response.internalServerError());
    }
    response.vouchers = userVoucher;
    res.json(response.success());
});
/* End for router V2*/

/* Below for routerV3: with csrPortal available */
routerV3.use(async function (req, res, next) {
    mLogger.info('=== Receiving %s %s API call with request data: %O %j ===', req.method, req.originalUrl, req.headers, req.body||req.query);
    let response = new Response();
    if (!req.headers['token']) {
        let user = {
            "base_info": {
              "accountId": 40000216,
              "agree": false,
              "nickname": "FET_Ted_Lin",
              "phone": "0900000016",
              "referral_code": "LHREOX",
              "sex": 0,
              "wwid": "fetnix.1546843584657989"
            },
            "err_code": 0,
            "token": "982f9c687cf29581214e6573c87cc620"
        };
        if (user.base_info && user.base_info.wwid) {
            req.userId = user.base_info.wwid;
            return next('route');
        }
    } 
    // mLogger.info('=== Receiving %s %s API call with request data: %O %j ===', req.method, req.originalUrl, req.headers, req.body||req.query);
    // let response = new Response();
    // if (req.headers['token']) {
    //     mLogger.info('Request By token ' + req.headers['token']);
    //     let user = await umClient.getUserInfoByToken(req.headers['token']);
    //     if (user.base_info && user.base_info.wwid) {
    //         req.userId = user.base_info.wwid;
    //         return next('route');
    //     }
    //     return res.json(response.invalidToken());
    // } else if (req.headers['cipher']) {
    //     mLogger.info('Request By cipher ' + req.headers['cipher']);
    //     let csrCrypto = new CSRCrypto();
    //     try {
    //         req.userId = csrCrypto.decrytion(req.headers['cipher']);
    //     } catch (error) {
    //         mLogger.error(error);
    //         return res.json(response.invalidRequest());
    //     }
    //     mLogger.info('descrypted userId = ' + req.userId);
    //     return next('route');
    // } else {
    //     return res.json(response.invalidRequest());
    // }
});

/* GET 查詢使用者裝置贈送的音樂權益領取狀態. */
routerV3.get('/vouchers', async function (req, res) {
    let response = new Response();
    let userVoucher;
    try {
        userVoucher = await userService.getUserVoucherV3(req.userId);
    } catch (error) {
        mLogger.error('Get vouchers occurred error %O', error);
        return res.json(response.internalServerError());
    }
    response.vouchers = userVoucher;
    res.json(response.success());
});
/* End for router V3*/

module.exports = {
    router: router,
    routerV2: routerV2,
    routerV3: routerV3
}
