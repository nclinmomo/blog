const Record = require('../../../models/domain/models/Record');

const SequelizeDevicesDispatchedRightsMapper = {

    toDatabase(device, rightsStatus) {
      const {deviceId, packageId, currentUserId:userId, status=rightsStatus} = device
      return {deviceId, packageId, userId, status};
    }
};

module.exports = SequelizeDevicesDispatchedRightsMapper;
