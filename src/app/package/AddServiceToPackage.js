'use strict'
const Operation = require('../../Operation.js');
const ServiceModel = require('../../../models/domain/models/Service');
const PackageServiceModel = require('../../../models/domain/models/PackageService');
const mUtils = require('../../../helpers/utils');
const t = require('tcomb-validation');
class AddServiceToPackage extends Operation {
    constructor(usersRepository) {
        super();
        this.usersRepository = usersRepository;
    }

    async execute(packageId, data) {
        const { SUCCESS, ERROR, VALIDATION_ERROR, DUP_ERROR} = this.outputs;

        try {
            const result = t.validate(data, ServiceModel);
            if (!result.isValid()) {
                const validationError = new Error('ValidationError');
                validationError.details = result.errors[0].message;
                throw validationError;
            }
            const {sdpProductId} = data;
            const newPackage = await this.usersRepository.addService(packageId, sdpProductId);
            this.emit(SUCCESS, newPackage);
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

AddServiceToPackage.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'DUP_ERROR']);

module.exports = AddServiceToPackage;
