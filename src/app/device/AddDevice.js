const Operation = require('../../Operation.js');
const DeviceModel = require('../../../models/domain/models/Device');
const mUtils = require('../../../helpers/utils');
const t = require('tcomb-validation');
class AddDevice extends Operation {
    constructor(usersRepository) {
        super();
        this.usersRepository = usersRepository;
    }

    async execute(deviceData) {
        const { SUCCESS, ERROR, VALIDATION_ERROR, DUP_ERROR, MULTIPLE_ERROR} = this.outputs;

        try {
            deviceData.deviceId = mUtils.generateDeviceId();
            const result = t.validate(deviceData, DeviceModel);
            if (!result.isValid()) {
                const validationError = new Error('ValidationError');
                validationError.details = result.errors[0].message;
                throw validationError;
            }
            const device = new DeviceModel(deviceData);
            const newDevice = await this.usersRepository.add(device);
            this.emit(SUCCESS, newDevice);
        } catch(error) {
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

AddDevice.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'DUP_ERROR', 'MULTIPLE_ERROR']);

module.exports = AddDevice;
