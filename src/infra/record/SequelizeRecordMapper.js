const Record = require('../../../models/domain/models/Record');

const SequelizeRecordMapper = {
    toEntity({ dataValues }) {
      return new Record(dataValues);
    },

    /**
     * TODO: Generate deviceId
     * @param {*} device 
     */
    toDatabase(device, reason) {
      const {deviceId, macAddr, serialNo, partNo, currentUserId:userId, description=reason} = device
      return {deviceId, macAddr, serialNo, partNo, userId, description};
    }
};

module.exports = SequelizeRecordMapper;
