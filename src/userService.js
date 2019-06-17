var SequelizexxxRepository = require('./repository/SequelizexxxRepository');

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


exports.insertOrder = insertOrder;