const mLogger = require('../src/configs/logger.js').log4js.getLogger('test/zzz');
console.log = mLogger.info.bind(mLogger);



describe('Utest/zzz describe', function () {
    before(function (done) {
        mLogger.info('before-------------------------------------------------------------------------------------------------');
        done();
    });

    it('Utest/zzz it', function(done) {
        mLogger.info('it-------------------------------------------------------------------------------------------------');
        done();
    });

    after(function (done) {
        mLogger.info('after-------------------------------------------------------------------------------------------------');
        done();
    });
});


