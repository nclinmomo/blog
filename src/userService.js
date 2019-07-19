var SequelizexxxRepository = require('./repository/SequelizexxxRepository');
var SequelizeProdRedeemValidRepository = require('./repository/SequelizeProdRedeemValidRepository');
async function insertOrder(insertData, description) {
    try {
        insertData.description = description;
        await SequelizeOrderInfoRepository.insertOrder(insertData.userId,
                insertData.sdpProductId, insertData.deviceId, insertData.orderId,
                insertData.modelName, insertData.voucherCode, insertData.description,
                insertData.createUser);
    } catch (error) {
        throw error;
    }
}

async function validateRedeemBuy(productId, accessToken) {
    try {
        var redeemCode = await SequelizeProdRedeemValidRepository.getRedeemCodeByProdId(productId);
        //判斷是Prod ID是否存在
        if (!redeemCode) {
            return {status: INVALID_PROD_ID, message: 'Prod Id not found'};
        }
        //KKBOX Redeem
        let kkboxInfo = await kkboxClient.redeemValidate(accessToken, redeemCode);
        mLogger.info('%s redeemValidate result: %j', accessToken, kkboxInfo);
        if (kkboxInfo.message == 'ok') {
            return {status: VALIDATE_SUCCESS, message: kkboxInfo.message};
        } else {
            return {status: OTHER_ERROR, message: kkboxInfo.message};
        }
    } catch (error) {
        mLogger.error('[validateRedeemBuy/%s] - error: %O', accessToken, error);
        if (error.message === UNAUTHORIZED) {
            return {status: UNAUTHORIZED, message: error.details};
        } else if (error.message === INVALID_PARAMETER) {
            return {status: INVALID_PARAMETER, message: error.details};
        } else if (error.message === VALIDATE_ERROR) {
            return {status: VALIDATE_ERROR, message: error.details};
        }
        throw error;
    }
}

exports.insertOrder = insertOrder;
exports.validateRedeemBuy = validateRedeemBuy;