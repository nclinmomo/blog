const DeviceMapper = require('./SequelizeDevicesDispatchedRightsMapper');

class SequelizeDevicesDispatchedRightsRepository {
    constructor(Device) {
        this.DeviceModel = Device;
    }

    async countByUserId(userId) {
        try {
            return await this.DeviceModel.count(
                {
                    where : {
                        userId
                    }
                }
            ).then(function(result) {
                return result;
            });
        } catch (error) {
            throw error;
        }
    }

    async add(device, status) {
        try {
            const newDeviceDispatchedRights = await this.DeviceModel.create(DeviceMapper.toDatabase(device, status));
            return newDeviceDispatchedRights;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = SequelizeDevicesDispatchedRightsRepository;
