var express = require('express');
var router = express.Router();
// var db = require('../src/configs/mysqlConnection');
/* GET users listing. */
const mLogger =require('../src/configs/logger').log4js.getLogger('routes/controller');
// const mLogger =require('../src/configs/logger').log4js.getLogger('cheese');

const Response = require('../src/Response');

const { TOKEN_NOT_FOUND } = require('../src/constants');

const umClient = require('../src/client/umClient');

const mUserService = require('../src/userService');

router.post('/validateRedeemBuy', async function(req, res, next) {
  mLogger.info('=== Receiving %s %s API call with request data: %j ===', req.method, req.originalUrl, req.query, req.body);
  var response = new Response();
  // if (!req.headers['token']) return res.json(response.invalidRequest(TOKEN_NOT_FOUND));

  try {
    //validate UM token
    // let tokenInfo = await umClient.validateToken(req.headers['token']);
    // mLogger.info('%s validateToken result: %j', req.headers['token'], tokenInfo);
    
    let kkboxResult = await mUserService.validateRedeemBuy(req.body.productId, req.body.accessToken);
    mLogger.info('kkboxResult');
  } catch (err) {
    mLogger.error(`catch err: ${err}`);
    return res.json(response.internalServerError(err.message));
  }


  res.send('validateRedeemBuy');
});

module.exports = router;
