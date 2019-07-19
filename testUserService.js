const mLogger = require('../src/configs/logger.js').log4js.getLogger('test/test.userService');
console.log = mLogger.info.bind(mLogger);
const Request = require('supertest');
const mServer = require('../bin/www');
const Assert = require('assert');
const mAgent = Request('http://localhost:3000');
const Response = require('../src/Response.js');
const mModels  = require('../src/models');
const sinon = require('sinon');
const moment = require('moment');

describe('Test get user information', function () {
    //預設測試資料1.完整的user資訊
    var userid1 = 'rrr';
    var orderId1 = 'uuu';
    var sdpProductId = 'testpd101'
    var umClient;
    var stubGetToken;
    var testProduct = {
        'sdpProductId': sdpProductId,
        'productName': 'base voice service 60 day',
        'duration': 10,
        'currency': 'NTD',
        'price': 600,
        'createUser': 'SYS'
    };
    before(function(done) {
        mModels.product_info.create(testProduct, { ignoreDuplicates: true })
            .then(function (result) {
                mLogger.info('Success to insert test data.');
                done();
            }).catch(function (err) {
                mLogger.error('Failed to add test data.: ' + err);
                done();
            });
    });
    before(function (done) {
        umClient = require('../src/user/client/umClient');
        stubGetToken = sinon.stub(umClient, 'getToken');
            stubGetToken.withArgs('testur101')
            .returns({
                err_code: 50001,
                err_msg: '第三方授权信息不存在'
            });
            
        kkboxClient = require('../src/user/client/kkboxClient');
        stubKKBOX = sinon.stub(kkboxClient, 'redeemDevice');
            stubKKBOX.withArgs('qqq')
            .returns([
                {
                "code": 201,
                "message": "Redeemed successfully"
                }
            ]);
            
            let errorUNAUTHORIZED = new Error('UNAUTHORIZED');
            errorUNAUTHORIZED.details = 'UNAUTHORIZED_details';
            stubKKBOX.withArgs('xxx')
            .throws(errorUNAUTHORIZED);
            let errorthirdPartyError = new Error('thirdPartyError');
            errorthirdPartyError.details = 'thirdPartyError_details';
            stubKKBOX.withArgs('yyy')
            .throws(errorthirdPartyError);
        done();
    });

    it('[1 get user token] request valid error', function(done) {
        var request = {
            'userId': userid2,
            'channel': 'OM',
            'orderInfo': {
                'orderId': orderId2,
                'productId': sdpProductId,
                'price': 'abc123'
            },
            'txDate': '2018-12-01 10:10:10',
            'chargeDate': '2018-12-01 10:10:10',
            'action': 'activated',
            'extra': {
                'deviceId': '1234567890',
                'modelName': 'WF62018',
                'voucherCode': 'abc123401'
            }
        };
        var expect = new Response();
        mAgent
            .post('/api/v1/user/ordrCre')
            .set('Content-Type', 'application/json')
            .send(request)
            .end(function(err, res) {
                if (err) return done(err);
                mLogger.debug(res.text);
                Assert.equal(JSON.parse(res.text).errCode, expect.invalidRequest().errCode);
                done();
            });
    });



    //刪除測試資料
    after(function (done) {
        mUserServiceProd.getProdByProdId.restore();
        Promise.all([
            destroyOrder(orderId10 + '_'),
        ]).then((result) => {
            mLogger.info('Success to delete test data.');
            done();
        }).catch((err) => {
            mLogger.error('Failed to delete test data.: ' + err);
            done();
        })
    });
});


/* === Remove test user data: Token & Address === */
function destroyProd(prodId) {
    return mModels.product_info.destroy({
        where: {
            'sdpProductId': prodId
        }
    });
}

function destroyOrder(orderId) {
    return mModels.order_log.destroy({
        where: {
            'orderId': orderId
        }
    });
}

function destroyRedeem(redeemCode) {
    return mModels.redeem_codes.destroy({
        where: {
            'redeemCode': redeemCode
        }
    });
}

function destroyRedeemInfo(orderId) {
    return mModels.redeem_logs.destroy({
        where: {
            'orderId': orderId
        }
    });
}

function destroyValidateRedeem(prodId) {
    return mModels.product_redeem_validate.destroy({
        where: {
            'sdpProductId': prodId
        }
    });
}

function destroySubscription(userId) {
    return mModels.subscription_log.destroy({
        where: {
            userId
        }
    });
}