const log4js = require('log4js');
const debug = require('./logger_debug_config.js');
const production = require('./logger_production_config.js');

/*
*  usage :
*    var mLogger = require('[path]/helpers/mLogger.js').log4js.getLogger('your tag name');
*    mLogger.trace();
*    mLogger.debug();
*    mLogger.info();
*    mLogger.warn();
*    mLogger.error();
*    mLogger.fatal();
*
*    connect/express mLogger:
*      http responses 3xx, level = WARN
*      http responses 4xx & 5xx, level = ERROR
*      else, level = INFO
*
*  Develop phase:
*    export NODE_ENV=DEVELOP
*  PRODUCT phase:
*    export NODE_ENV=PRODUCT
*/

if (process.env.NODE_ENV === 'production') {
    log4js.configure(production);
} else {
    log4js.configure(debug);
}

module.exports = {
    express : log4js
            .connectLogger(log4js.getLogger('express'), {level: 'auto', format: ':method :url'}),
    log4js : log4js
};