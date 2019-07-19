const Operation = require('../../Operation.js');
const DeviceModel = require('../../../models/domain/models/Device');
const mUtils = require('../../../helpers/utils');
const t = require('tcomb-validation');
class UpdateDevice extends Operation {
    constructor(usersRepository) {
        super();
        this.usersRepository = usersRepository;
    }

    async execute(deviceId, deviceData) {
        const { SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND, DuplicateError} = this.outputs;

        try {
            const updateDevice = await this.usersRepository.update(deviceId, deviceData);

            // const result = t.validate(deviceData, DeviceModel);
            // if (!result.isValid()) {
            //     const validationError = new Error('ValidationError');
            //     console.log('~~~~~ ', result.firstError())
            //     validationError.details = result.errors[0].message;
            //     throw validationError;
            // }
            // const device = new DeviceModel(deviceData);
            
            this.emit(SUCCESS, updateDevice);
        } catch(error) {
            if (error.message === 'ValidationError') {
                this.emit(VALIDATION_ERROR, {
                    type: error.message,
                    details: error.details
                });
            } else if (error.message === 'NotFoundError') {
                this.emit(NOT_FOUND, {
                    type: error.message,
                    details: error.details
                });
            } else {
                this.emit(ERROR, error);
            }
        }
    }
}

UpdateDevice.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND', 'DuplicateError']);

module.exports = UpdateDevice;
