const Record = require('../../../models/domain/models/Record');

const SequelizeDeviceMapper = {
    toEntity({ dataValues }) {
        //const { deviceId, macAddr, modelName, serialNo, deviceCatgId, packageId, userId } = dataValues;

        //return new Device({ deviceId, macAddr, modelName, serialNo, deviceCatgId, packageId, userId});
        return new Record(dataValues);
    },

    toDatabase(data) {
        const convertData = [];
        for (var {userId, deviceId, serialNo, partNo, description, createdAt:activatedDatetime} of data) {
            convertData.push({userId, deviceId, serialNo, partNo, description, activatedDatetime});
        }
        return convertData;
    }
};

module.exports = SequelizeDeviceMapper;
