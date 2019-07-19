const mLogger = require('../src/configs/logger.js').log4js.getLogger('test/test.health');
const Request = require('supertest');
const mAgent = Request('http://localhost:3000');
const Assert = require('assert');
const HttpsProxyAgent = require('https-proxy-agent');
// const moment = require('moment');
// const moment = require('moment-timezone');
const momentTimezone = require('moment-timezone');

const testConst = 'testConst';
describe('Test get user information', function () {
    mLogger.info(testConst);
    //預設測試資料1.完整的user資訊
    var userid = 'fetnix.1234567890123456000';
    var aToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NjY5ODE3NTcsImtleSI6IlUyRnNkR1ZrWDE5dm0vY2VZRjBnL0NzakdvdklkT2RLaE40NHlUbVJiZWJIZ2tTdUlVbUZZM3BSSnZpZDRDWmVEay9DbVB6UnNKZVZnMGlHcml1bUdBPT0iLCJhcHBfaWQiOiItTEtlZzZ3bzhuQWxpZWdPaFhfRCIsImlhdCI6MTUzNTQ0NTc1N30.oTxnWHoYVeX_yELMWhnuwfZ3NylCeTQcDE57BdxQ2os';
    var aTokenExpires = '2018-09-13 00:00:00';
    var rToken = 'eyJhbGciOiJIUzI1NiIsInR';
    var rTokenExpires = '2018-09-14 00:00:00';
    var tStatus = '1'
    var cAt1 = '2018-09-12 00:00:00';
    var cBy1 = 'HW';

    var address = '台北市羅斯福路三段162號';
    var alias = '家';
    var lat = '25.019946';
    var lng = '121.52912';
    var cAt2 = '2018-09-14 00:00:00';
    var cBy2 = 'HW';

    var testtoken = {
        'userId' : userid,
        'accessToken' : aToken,
        'accessTokenExpires' : aTokenExpires,
        'refreshToken' : rToken,
        'refreshTokenExpires' : rTokenExpires,
        'createdAt' : cAt1,
        'modifyBy' : cBy1

    }
    var testaddress = {
        'userId' : userid,
        'address' : address,
        'alias' : alias,
        'lat' : lat,
        'lng' : lng,
        'createdAt' : cAt2,
        'modifyBy' : cBy2
    }

    var userData = [
        {
            userId: 'fetnix.1525854222391111',
            accessToken: '111111',
            accessTokenExpires: '2019-06-15 00:00:00',
            refreshToken: '111',
            refreshTokenExpires: '2018-09-14 00:00:00',
            modifyBy: 'HW'
        },
        {
            userId: 'fetnix.1526037095222222',
            accessToken: '2222',
            accessTokenExpires: '2019-06-15 00:00:00',
            refreshToken: '2222',
            refreshTokenExpires: '2018-09-14 00:00:00',
            modifyBy: 'HW'
        }
    ];

    //預設測試資料2.該user只設定token會回傳無address
    var userid2 = 'fetnix.noAddress';
    var aToken2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NjY5ODE3NTcsImtleSI6IlUyRnNkR1ZrWDE5dm0vY2VZRjBnL0NzakdvdklkT2RLaE40NHlUbVJiZWJIZ2tTdUlVbUZZM3BSSnZpZDRDWmVEay9DbVB6UnNKZVZnMGlHcml1bUdBPT0iLCJhcHBfaWQiOiItTEtlZzZ3bzhuQWxpZWdPaFhfRCIsImlhdCI6MTUzNTQ0NTc1N30.oTxnWHoYVeX_yELMWhnuwfZ3NylCeTQcDE57BdxQ2os';
    var aTokenExpires2 = '2018-09-13 00:00:00';
    var rToken2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI';
    var rTokenExpires2 = '2018-09-14 00:00:00';
    var cAt3 = '2018-09-12 00:00:00';
    var cBy3 = 'HW';

    var testtoken2 = {
        'userId' : userid2,
        'accessToken' : aToken2,
        'accessTokenExpires' : aTokenExpires2,
        'refreshToken' : rToken2,
        'refreshTokenExpires' : rTokenExpires2,
        'createdAt' : cAt3,
        'modifyBy' : cBy3
    }

    //預設測試資料3.該user只設定address會回傳無token
    // var userid3 = 'fetnix.noToken';
    // var address2 = '台北市羅斯福路三段162號';
    // var alias2 = '家';
    // var lat2 = '25.019946';
    // var lng2 = '121.52912';
    // var cAt4 = '2018-09-14 00:00:00';
    // var cBy4 = 'HW';

    // var testaddress2 = {
    //     'userId' : userid3,
    //     'address' : address2,
    //     'alias' : alias2,
    //     'lat' : lat2,
    //     'lng' : lng2,
    //     'createdAt' : cAt4,
    //     'modifyBy' : cBy4
    // }

    // var useridRefresh = 'fetnix.refresh_token';

    // var refresh = {
    //     "access_token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDA3ODUwODAsImtleSI6IlUyRnNkR1ZrWDE5T2VBaFF1TjFpeDJVN0ZGYVE0ellhcTgyR1Z2aFlpWkNQbjd1Szl1ZkF4cVJQUGJlRUgzMmh1cCtEblB5d1BPaG5IVTVhTUJTdEpBPT0iLCJhcHBfaWQiOiItTEtlZzZ3bzhuQWxpZWdPaFhfRCIsImlhdCI6MTU0MDE4MDI4MH0.4VJ0V8C8C_QnbEczVQAPUH8VqvEb08Uu3zbJAmJruw4",
    //     "expires_in" : 604800,
    //     "token_expiry_date" : 1540785080
    // };


    /* === Add test user data === */
    before(function(done) {

        // console.log(momentTimezone.tz.zone('Etc/GMT-8').offsets[0]);
        mLogger.info(momentTimezone.tz.zone('Etc/GMT-8').offsets[0]);

        // let sOutput = getDatetimeUTCForEtcGMTFormat('2019-07-01 17:10:24 Etc/GMT-8');
        // if(sOutput === '2019-07-01 09:10:24 UTC'){
        //     console.log('ok');
        // }


        // let nowMs = moment().valueOf();
        // let nowUTC = moment().utc().valueOf();
        // moment.utc().valueOf();
        // // console.log(moment().format("YYYY-MM-DDTHH:mm:ssZ"));
        // // console.log(moment().toISOString());
        // // console.log(moment.utc().format('ddd MMM DD YYYY HH:mm:ss z'));
        // // console.log(moment.utc().add(4, 'days').format('ddd MMM DD YYYY HH:mm:ss z'));
        // // console.log(moment.utc().add(4, 'days').format('ddd MMM DD YYYY HH:mm:ss z'));
        // // console.log(moment().tz('Etc/GMT+1').format('YYYY-MM-DD HH:mm ZZ'));
        // console.log(moment.utc('2019-07-01 17:10:24').add(moment.tz.zone("Etc/GMT-1").offsets[0]/60, 'hours').format('ddd MMM DD YYYY HH:mm:ss z'));
        // // console.log(moment.tz('Etc/GMT+8').utcOffset());
        // // 2017-11-17 14:41:34 Etc/GMT
        // // console.log(moment.utc().toDate().toUTCString());
        // console.log(moment('2019-07-01 18:10:24').format());
        // console.log(moment.utc('2019-07-01 18:10:24').utcOffset(moment.tz.zone("Etc/GMT-1").offsets[0]/60, true).format());
        // console.log(moment.tz.zone("Etc/GMT-1").offsets[0]/60);
        // console.log(moment.tz.zone("Etc/GMT+1").offsets[0]/60);
        // console.log(moment.tz.zone("Asia/Magadan").offsets[0]);
        // console.log(moment.utc().format("YYYY/MM/DD HH:mmZ"));
        // console.log(moment.utc().format("YYYY-MM-DD HH:mm:ss z"));
        // console.log(moment.utc('2019-07-01 17:10:24').format("YYYY-MM-DD HH:mm:ss z"));
        // console.log(moment.utc('2019-07-01 17:10:24').add(moment.tz.zone("Etc/GMT").offsets[0]/60, 'hours').format("YYYY-MM-DD HH:mm:ss z"));

        // let sInputDateTime = '2019-07-01 17:10:24 Etc/GMT-8';
        // let sDateTime = sInputDateTime.substring(0,sInputDateTime.lastIndexOf(' '));
        // let sTimeZone = sInputDateTime.substring(sInputDateTime.lastIndexOf(' ')+1);
        // if(sTimeZone.indexOf('Etc/GMT') >= 0){
        //     console.log(moment.utc(sDateTime).add(moment.tz.zone(sTimeZone).offsets[0]/60, 'hours').format("YYYY-MM-DD HH:mm:ss z"));
        // }


        // if (moment.tz.zone("Etc/GMT-7").offsets[0]/60 === -7){
        //     console.log('ok');
        // }
        // let testTime = moment.utc('2019-07-01 17:10:24').add(moment.tz.zone("Etc/GMT-8").offsets[0]/60, 'hours').format("YYYY-MM-DD HH:mm:ss z");
        // if (testTime === '2019-07-01 09:10:24 UTC'){
        //     console.log('ok');
        // }
        // let mapUser = [];
        // for (let {userId} of userData) {
        //     mapUser.push({userId});
        // }
        // console.log(mapUser);
        // console.log(111);
        // mModels.token.create(testtoken, { ignoreDuplicates: true })
        //         .then(function (result) {
        //             return mModels.address.create(testaddress, { ignoreDuplicates: true })
        //                     .then(function (result) {
        //                         return mModels.token.create(testtoken2, { ignoreDuplicates: true })
        //                                 .then(function (result) {
        //                                     return mModels.address.create(testaddress2, { ignoreDuplicates: true })
        //                                             .then(function (result) {
        //                                                 mLogger.info('Success to insert test data.');
        //                                                 done();
        //                                             });
        //                                 });
        //                     });
        //         }).catch(function (err) {
        //             mLogger.error('Failed to add test data.: ' + err);
        //             done();
        //         });
        done();
    });

    it('[1 get user information] should response error about no token', function(done) {
        console.log(222);
        // var expect = new Response();
        // mAgent
        //     .get('/api/tgs/v1/user/' + userid3)
        //     .end(function(err, res) {
        //         if (err) return done(err);
        //         mLogger.debug(res.text);
        //         Assert.equal(JSON.parse(res.text).errCode, expect.unauthorized().errCode);
        //         done();
        //     });
        done();
        console.log(333);
    });


    describe('Get user profile, 使用者有設定預設和常用地址', function () {
        mLogger.info(testConst);
        console.log(testtoken);
        var taxiGoClient;
        var favorite = [
            { address: '台北市內湖區瑞光路468號', lat: 25.078342, lng: 121.569943 },
            { address: '台北科技大學 (台北市大安區)', lat: 25.0422329, lng: 121.5354974 },
            { address: '新北市板橋區中山路一段1號', lat: 25.007416, lng: 121.459371 }
        ];
        before(function (done) {
            console.log(testtoken);
            console.log(444);
            // taxiGoClient = require('../src/ride/client/taxiGoClient');
            // sinon.stub(taxiGoClient, 'getRiderProfile').callsFake(function () {
            //     return {
            //         name: 'Howard',
            //         profile_img: 'http://dl.profile.line-cdn.net/0hMz6H2Xv-ElULMT1DhMZtAjd0HDh8HxQdcwRaZyxkSGImCFwCMl9YZC5iSzdyAVILPlVYO3o0RGwl',
            //         favorite
            //     };
            // });
            console.log(555);
            done();
            console.log(666);
        });
    
        after(function (done) {
            console.log(777);
            // taxiGoClient.getRiderProfile.restore();
            done();
        });
    
        it('[2 get user information] should response success', function(done) {
            mLogger.info(testConst);
            console.log(888);
    
            done();
    
            console.log(999);
            // var expect = new Response();
            // mAgent
            //     .get('/api/tgs/v1/user/' + userid)
            //     .end(function(err, res) {
            //         if (err) return done(err);
            //         mLogger.debug(res.text);
            //         Assert.equal(JSON.parse(res.text).errCode, expect.success().errCode);
            //         Assert.equal(JSON.parse(res.text).userProfile.address.default.address, testaddress.address);
            //         Assert.equal(JSON.parse(res.text).userProfile.address.default.lat, testaddress.lat);
            //         Assert.equal(JSON.parse(res.text).userProfile.address.default.lng, testaddress.lng);
            //         Assert.deepStrictEqual(JSON.parse(res.text).userProfile.address.favorite, favorite);
            //         done();
            //     });
        });
    });
    
});



// describe('Test health', function () {

//     console.log('Test health')

// //     // before(function(done) {
// //     //     mAgent
// //     //     .get('/')
// //     //     .end(function(err, res) {
// //     //         console.log('before end')
// //     //         done();
// //     //     });
// //     // });

//     it('should response success', function(done) {
//          console.log('should response success')
//         mAgent
//             .get('/')
//             .end(function(err, res) {
//                 if (err) return done(err);
//                 mLogger.debug(res.text);
//                 // Assert.equal(JSON.parse(res.text).status, "200");
//                 Assert.equal(res.status, "200");
//                 // console.log('it end')
//                 done();
//             });
//     });

//     it('test success', function(done) {
//         console.log('test success')
//         mAgent
//             .get('/')
//             .end(function(err, res) {
//                 if (err) return done(err);
//                 mLogger.debug(res.text);
//                 // Assert.equal(JSON.parse(res.text).status, "200");
//                 Assert.equal(res.status, "200");
//                 // console.log('it end')
//                 done();
//             });
//     });

// });


function getDatetimeUTCForEtcGMTFormat(sInputDateTime) {
    let sDateTime = sInputDateTime.substring(0,sInputDateTime.lastIndexOf(' '));
    let sTimeZone = sInputDateTime.substring(sInputDateTime.lastIndexOf(' ')+1);
    if(sTimeZone.indexOf('Etc/GMT') >= 0){
        return momentTimezone.utc(sDateTime).add(momentTimezone.tz.zone(sTimeZone).offsets[0]/60, 'hours').format("YYYY-MM-DD HH:mm:ss z");
    }
}