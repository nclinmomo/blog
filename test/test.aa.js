const mLogger = require('../src/configs/logger.js').log4js.getLogger('test/test.aa');
console.log = mLogger.info.bind(mLogger);



describe('Utest/test.aa describe', function () {
    before(function (done) {
        mLogger.info('before-------------------------------------------------------------------------------------------------');
        done();
    });

    it('Utest/test.aa it', function(done) {
        mLogger.info('it-------------------------------------------------------------------------------------------------');
        done();
    });

    after(function (done) {
        mLogger.info('after-------------------------------------------------------------------------------------------------');
        done();
    });
});


