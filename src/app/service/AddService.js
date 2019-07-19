const Operation = require('../../Operation.js');
const ServiceModel = require('../../../models/domain/models/Service');
const mUtils = require('../../../helpers/utils');
const t = require('tcomb-validation');
class AddService extends Operation {
    constructor(usersRepository) {
        super();
        this.usersRepository = usersRepository;
    }

    async execute(serviceData) {
        const { SUCCESS, ERROR, VALIDATION_ERROR, DUP_ERROR} = this.outputs;

        try {
            const result = t.validate(serviceData, ServiceModel);
            if (!result.isValid()) {
                const validationError = new Error('ValidationError');
                validationError.details = result.errors[0].message;
                throw validationError;
            }
            const service = new ServiceModel(serviceData);
            const newService = await this.usersRepository.add(service);
            this.emit(SUCCESS, newService);
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

AddService.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'DUP_ERROR']);

module.exports = AddService;
