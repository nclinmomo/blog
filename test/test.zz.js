const mLogger = require('../src/configs/logger.js').log4js.getLogger('test/test.zz');
console.log = mLogger.info.bind(mLogger);
// mLogger.info(testConst);
const testConst = 'testConst';

describe('Utest/test.zz describe', function () {
    mLogger.info(testConst);
    before(function (done) {
        mLogger.info('before-------------------------------------------------------------------------------------------------');
        done();
    });

    it('Utest/test.zz it', function(done) {
        mLogger.info('it-------------------------------------------------------------------------------------------------');
        done();
    });

    after(function (done) {
        mLogger.info('after-------------------------------------------------------------------------------------------------');
        done();
    });
});


