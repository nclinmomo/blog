'use strict'
const Operation = require('../../Operation.js');
const PackageModel = require('../../../models/domain/models/Package');
const mUtils = require('../../../helpers/utils');
const t = require('tcomb-validation');
class AddPackage extends Operation {
    constructor(usersRepository) {
        super();
        this.usersRepository = usersRepository;
    }

    async execute(packageData) {
        const { SUCCESS, ERROR, VALIDATION_ERROR, DUP_ERROR} = this.outputs;

        try {
            packageData.packageId = mUtils.generatePackageId();
            const result = t.validate(packageData, PackageModel);
            if (!result.isValid()) {
                const validationError = new Error('ValidationError');
                validationError.details = result.errors[0].message;
                throw validationError;
            }
            const newPackage = await this.usersRepository.add(new PackageModel(packageData));
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

AddPackage.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'DUP_ERROR']);

module.exports = AddPackage;
