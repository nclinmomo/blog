const mLogger = require('../src/configs/logger.js').log4js.getLogger('test/test.health');
const Request = require('supertest');
const mAgent = Request('http://localhost:3000');
const Assert = require('assert');

describe('Test health', function () {

    // console.log('Test health')

//     // before(function(done) {
//     //     mAgent
//     //     .get('/')
//     //     .end(function(err, res) {
//     //         console.log('before end')
//     //         done();
//     //     });
//     // });

    it('should response success', function(done) {
        // console.log('it')
        mAgent
            .get('/')
            .end(function(err, res) {
                if (err) return done(err);
                mLogger.debug(res.text);
                // Assert.equal(JSON.parse(res.text).status, "200");
                Assert.equal(res.status, "200");
                // console.log('it end')
                done();
            });
    });

    it('test success', function(done) {
        // console.log('it')
        mAgent
            .get('/')
            .end(function(err, res) {
                if (err) return done(err);
                mLogger.debug(res.text);
                // Assert.equal(JSON.parse(res.text).status, "200");
                Assert.equal(res.status, "200");
                // console.log('it end')
                done();
            });
    });

});