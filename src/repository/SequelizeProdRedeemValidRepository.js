const mLogger = require('../configs/logger').log4js.getLogger('src/repository/SequelizeProdRedeemValidRepository');
var ProductDBModel = require('../models').product_redeem_validate;

class SequelizeProdRedeemValidRepository {
    constructor(ProductDBModel) {
        this.ProductDBModel = ProductDBModel;
    }

    //使用prodId取得相關的redeemCode資訊
    getRedeemCodeByProdId(sdpProductId) {
        return this.ProductDBModel.findOne({
            attributes: ['redeemCode'],
            raw: true,
            where: {
                sdpProductId
            }
        }).then(function (result) {
            mLogger.info(`[getRedeemCodeByProdId] result: ${JSON.stringify(result)}`);
            return result;
        }).catch(function (err) {
            mLogger.error(`[getRedeemCodeByProdId] err: ${err}`);
            let error = new Error('internalServerError');
            error.details = err.name;
            throw error;
        });
    }
}

module.exports = new SequelizeProdRedeemValidRepository(ProductDBModel);