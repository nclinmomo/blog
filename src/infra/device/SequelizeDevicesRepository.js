'use strict'
const t = require('tcomb-validation');
const mModel_validation = require('../../../models/domain/models/Device')
const DeviceMapper = require('./SequelizeDeviceMapper');
//const Device = require('../../domain/models/Device');
class SequelizeDevicesRepository {
    constructor(Device) {
        this.DeviceModel = Device;
    }

    async getAll(...args) {
        try {
            return await this.DeviceModel.findAll({ where : args, rejectOnEmpty: true, raw : true});
        } catch (error) {
            if (error.name === 'SequelizeEmptyResultError') {
                const notFoundError = new Error('NotFoundError');
                notFoundError.type = 'deviceNotFound';
                notFoundError.details = `Device with ${JSON.stringify(args)} can't be found.`;

                throw notFoundError;
            }
            throw error;
        }
    }

    async getById(deviceId) {
        const devices = await this.getInfoById(deviceId);
        return devices;
    }

    async getOne(...args) {
        try {
            return await this.DeviceModel.findOne({ where: args, rejectOnEmpty: true });
        } catch (error) {
            if (error.name === 'SequelizeEmptyResultError') {
                const notFoundError = new Error('NotFoundError');
                notFoundError.details = `Device with ${JSON.stringify(args)} can't be found.`;

                throw notFoundError;
            }
            throw error;
        }
    }

    async add(device) {
        try {
            const newDevice = await this.DeviceModel.create(DeviceMapper.toDatabase(device));
            return DeviceMapper.toEntity(newDevice);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                const duplicateError = new Error('DuplicateError');
                //notFoundError.details = `Device with id ${deviceId} can't be found.`;
                duplicateError.details = `[ ${error.errors[0].type} ] Device with ${error.errors[0].value} can't be add.`;
                throw duplicateError;
            }
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                const validationError = new Error('ValidationError');
                //notFoundError.details = `Device with id ${deviceId} can't be found.`;  //TODO: detail??
                //validationError.details = error.message;
                throw validationError;
            }
            throw error;
        }
    }

    async addRows(deviceInfo) {
        const {macAddr, serialNo, partNo} = deviceInfo;
        try {

            const newDevice = await this.DeviceModel.findCreateFind(
                {
                    where : {
                        macAddr,
                        serialNo,
                        partNo
                    },
                    defaults: DeviceMapper.toDatabase(deviceInfo),
                    raw: true
                })
                .spread((device, created) => {
                    var detail = DeviceMapper.toEntity(device);
                    const data = {
                        detail,
                        created
                    }
                    return data;
                });
                return newDevice;
        } catch (error) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                var detail = DeviceMapper.toEntity(deviceInfo);
                const data = {
                    detail,
                    created : false,
                    invalidParam : true
                }
                return data;
            }
            throw error;
        }
    }

    async deleteById(deviceId) {
        const device = await this.getInfoById(deviceId);
        await device.destroy();
        return;
    }

    async update(deviceId, newData) {
        const device = await this.getInfoById(deviceId);
        try {
            const updatedDevice = await device.update(newData);
            const deviceEntity = DeviceMapper.toEntity(updatedDevice);

            const result = t.validate(deviceEntity, mModel_validation);
            if (!result.isValid()) {
                const validationError = new Error('ValidationError');
                validationError.details = result.errors[0].message;
                throw validationError;
            }

            return deviceEntity;
        } catch(error) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                const validationError = new Error('ValidationError');
                //notFoundError.details = `Device with id ${deviceId} can't be found.`;  //TODO: detail??
                validationError.details = error.message;
                throw validationError;
            }
            throw error;
        }
    }

    // Private
    async getInfoById(deviceId) {
        try {
            return await this.DeviceModel.findOne({ where : {deviceId}, rejectOnEmpty: true });
        } catch(error) {
            if (error.name === 'SequelizeEmptyResultError') {
                const notFoundError = new Error('NotFoundError');
                notFoundError.details = `Device with id ${deviceId} can't be found.`;

                throw notFoundError;
            }
            throw error;
        }
    }

}
module.exports = SequelizeDevicesRepository;
