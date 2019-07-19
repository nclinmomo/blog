const mLogger = require('../src/configs/logger.js').log4js.getLogger('test/aaa');
console.log = mLogger.info.bind(mLogger);



describe('Utest/aaa describe', function () {
    before(function (done) {
        mLogger.info('before-------------------------------------------------------------------------------------------------');
        done();
    });

    it('Utest/aaa it', function(done) {
        mLogger.info('it-------------------------------------------------------------------------------------------------');
        done();
    });

    after(function (done) {
        mLogger.info('after-------------------------------------------------------------------------------------------------');
        done();
    });
});


