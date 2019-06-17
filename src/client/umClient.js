const axios = require('axios');
const UM = require('../configs/um_config');
const mLogger = require('../configs/logger').log4js.getLogger('src/ride/umClient');
const HttpsProxyAgent = require('https-proxy-agent');
const {OTHER_ERROR} = require('../constants');
if (process.env.HTTPS_PROXY) {
    var agent = new HttpsProxyAgent(process.env.HTTPS_PROXY);
}
/**
 * Get current user KKBOX token
 *
 * @param {String} userId user id
 */
function getToken(userId) {
    var options = {
        method: 'get',
        url: UM.UM_URI,
        httpsAgent: agent,
        proxy: false,
        params: {
            wwid: userId,
            type: 'kkbox-music'
        },
        timeout: 10000  // If the request takes longer than 30s, the request will be aborted.
    };
    return axios(options)
    .then(function (response) {
        mLogger.info('getToken result: %j', response.data);
        return response.data;
    })
    .catch(function (err) {
        // GET failed...
        errorMessage('getToken', err);
        // throw OTHER_ERROR;
        let error = new Error(OTHER_ERROR);
        error.details = 'UM_ERROR';
        throw error;
    });
}

function validateToken(tokenId) {
    var options = {
        method: 'get',
        url: UM.UM_VALID_TOKEN_URI,
        httpsAgent: agent,
        proxy: false,
        params: {
            origin: 'service-kkbox',
            token: tokenId
        },
        timeout: 10000  // If the request takes longer than 30s, the request will be aborted.
    };
    return axios(options)
    .then(function (response) {
        mLogger.info('validateToken result: %j', response.data);
        return response.data;
    })
    .catch(function (err) {
        // GET failed...
        errorMessage('validateToken', err);
        // throw OTHER_ERROR;
        let error = new Error(OTHER_ERROR);
        error.details = 'UM_validateToken_ERROR';
        throw error;
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

exports.getToken = getToken;
exports.validateToken = validateToken;