const Device = require('../../../models/domain/models/Device');

const SequelizeDeviceMapper = {
    toEntity( dataValues ) {
      //const { deviceId, macAddr, modelName, serialNo, deviceCatgId, packageId, userId } = dataValues;

      //return new Device({ deviceId, macAddr, modelName, serialNo, deviceCatgId, packageId, userId});
      return new Device(dataValues);
    },

    /**
     * TODO: Generate deviceId
     * @param {*} device 
     */
    toDatabase(device) {
      return device;
    }
};

module.exports = SequelizeDeviceMapper;
