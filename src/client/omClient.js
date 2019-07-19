const axios = require('axios');
const t = require('tcomb-validation');
const OM = require('../../configs/OM_config');
const mLogger = require('../../helpers/logger.js').log4js.getLogger('src/omClient');
const HttpsProxyAgent = require('https-proxy-agent');
if (process.env.HTTPS_PROXY) {
    var agent = new HttpsProxyAgent(process.env.HTTPS_PROXY);
}

/**
 * Call trasact API
 * @param {String} userId The user id
 * @param {Object} service
 * @param {String} service.sdpProductId The product id
 * @param {String} service.sdpPartnerId The partner id
 * @param {Object} device
 * @param {Object} device.deviceId The device id
 * @param {Object} device.serialNo The device serial no
 * @param {Object} device.modelName The device model name
 */
function transact(userId, service, device, voucherCode) {
    var options = {
        method: 'post',
        url: 'http://' + OM.host + ':' + OM.port + OM.path,
        data: {
            userId,
            shoppingList : {
                partnerId: service.sdpPartnerId,
                productId: service.sdpProductId
            },
            extra: {
                deviceId: device.deviceId,
                serialNo: device.serialNo,
                modelName: device.modelName,
                voucherCode
            },
            disableRetry: true
        },
        httpsAgent: agent,
        proxy: false
    };
    return axios(options)
    .then(function (response) {
        // POST succeeded...
        mLogger.info('transact result: %j', response.data);
        return response.data;
    })
    .catch(function (err) {
        // POST failed...
        errorMessage('transact', err);
        throw new Error('unknownError');
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

exports.transact = transact;
