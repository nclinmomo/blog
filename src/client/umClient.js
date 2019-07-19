const axios = require('axios');
const t = require('tcomb-validation');
const UM = require('../../configs/UM_config');
const mLogger = require('../../helpers/logger.js').log4js.getLogger('src/umClient');
const HttpsProxyAgent = require('https-proxy-agent');
if (process.env.HTTPS_PROXY) {
    var agent = new HttpsProxyAgent(process.env.HTTPS_PROXY);
}

/**
 * Get user information by token
 * @param {String} token user token
 */
function getUserInfoByToken(token) {
    var options = {
        method: 'get',
        url: UM.ACCOUNT_INFO,
        params: {
            origin: 'service-activation-management',
            token//: '231559b6fccb7404bb5f95987b3bd92d'
        },
        httpsAgent: agent,
        proxy: false
    };

    return axios(options)
    .then(function (response) {
        // GET succeeded...
        mLogger.info('getUserInfoByToken result: %j', response.data);
        return response.data;
    })
    .catch(function (err) {
        // GET failed...
        errorMessage('getUserInfoByToken', err);
        return {error: 'invalid token'};
    });
}

function errorMessage(action, error) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        mLogger.error('%s error status: %s, error data: %j ===', action, error.response.status, error.response.data);
        mLogger.error(action + ' error headers: %j', error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        mLogger.error('%s error request: %O', action, error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        mLogger.error(action + ' error message: ', error.message);
    }
    mLogger.error('%s config: %j', action, error.config);
}

exports.getUserInfoByToken = getUserInfoByToken;
