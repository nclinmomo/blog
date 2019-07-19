const Operation = require('../../Operation.js');
const DeviceModel = require('../../../models/domain/models/Device');
const mUtils = require('../../../helpers/utils');
const t = require('tcomb-validation');
class AddDevices extends Operation {
    constructor(usersRepository) {
        super();
        this.usersRepository = usersRepository;
    }

    async execute(deviceData) {
        const { SUCCESS, ERROR, VALIDATION_ERROR, DUP_ERROR, MULTIPLE_ERROR} = this.outputs;
        var invalidDevices = [];
        var dupDevices = [];
        var successDevices = [];
        try {
            for (var element of deviceData) {
                element.deviceId = mUtils.generateDeviceId();
                const result = t.validate(element, DeviceModel);

                if (!result.isValid()) {
                    delete element.deviceId;
                    invalidDevices.push(element);
                    continue;
                }
                const device = new DeviceModel(element);
                const newDevice = await this.usersRepository.addRows(device);
                (newDevice.created) ? successDevices.push(newDevice.detail) : (newDevice.invalidParam) ? invalidDevices.push(newDevice.detail) : dupDevices.push(newDevice.detail);
            }

            if (invalidDevices.length || dupDevices.length) return this.emit(MULTIPLE_ERROR, {successDevices, invalidDevices, dupDevices});
            this.emit(SUCCESS, {successDevices});
        } catch (error) {
            if (error.message === 'ValidationError') {
                this.emit(VALIDATION_ERROR, {
                    type: error.message,
                    details: error.details
                });
            } else if (error.message === 'DuplicateError') {
                this.emit(DUP_ERROR, {
                    type: error.message,
                    details: error.details
                });
            } else {
                this.emit(ERROR, error);
            }
        }
    }
}

AddDevices.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'DUP_ERROR', 'MULTIPLE_ERROR']);

module.exports = AddDevices;
