'strict mode'
const mLogger = require('../../helpers/logger').log4js.getLogger('models/HttpHandler');
const http = require('http');
const EventEmitter = require('events');
const Operation = require('../Operation.js');

class NotificationService extends Operation {
    constructor(reqOption) {
        super();
        if (NotificationService.instance) {
            return NotificationService.instance;
        }
        this.options = reqOption;
        NotificationService.instance = this;
    }

    get MAX_RETRY_COUNT() {
        return 3;
    }

    get DELAY_PREIOD() {
        return 180000;  // 3 minutes
    }
    /**
     * Send POST request
     */
    async post(postData, retryData) {
        this.options.method = 'POST';
        const self = this;
        return new Promise(function (resolve, reject) {
            var req = http.request(self.options,
                    function (res) {
                        var serviceResult = [];
    
                        res.on('data',
                            function (chunk) {
                                    serviceResult.push(chunk);
                                });
    
                        res.on('end',
                            function () {
                                mLogger.info('HTTP response data: ', serviceResult.toString());
                                var buffer = Buffer.concat(serviceResult);
                                try {
                                    if (JSON.parse(buffer.toString()).errCode !== '00') reject(new Error('OMError'));
                                    resolve(null, serviceResult);
                                } catch (error) {
                                    mLogger.error("OM Error ", error);
                                    reject(new Error('OMError'));
                                }
                            });
                    });

            req.on('socket',
                function (socket) {
                    socket.setTimeout(8000); // HTTP time out (default time is set to 8 secs)
                    socket.on('timeout',
                            function () {
                                req.abort();
                                mLogger.error('Connection timeout');
                            });
            });

            req.on('error',
                    function (err) {
                        mLogger.error('HTTP request occurs error: ', err.stack);
                        if (err.message.includes('ECONNREFUSED') || err.name === 'NetConnectNotAllowedError') {
                            let data = retryData || (function() {
                                var privateCounter = -1;
                                var privateData = postData;
                                function changeBy(val) {
                                    privateCounter += val;
                                }
                                return {
                                    increment: function() {
                                        changeBy(1);
                                    },
                                    retryCount: function() {
                                        return privateCounter;
                                    },
                                    value: function () {
                                        return privateData;
                                    }
                                };
                            })();
                            data.increment();
                            // If we are still getting the same fault, keep retrying until the maximum retry count is hit.
                            self.emit('HTTP_Error', data);
                        }
                        reject(new Error('HTTPError'));
                    });

            const reqData = postData || retryData.value();
            mLogger.info('Send to OM: ', reqData);
            req.write(JSON.stringify(reqData)); // write data to request body
    
            req.end();
        });
    }
}
NotificationService.setOutputs(['HTTP_Error']);

module.exports = NotificationService;