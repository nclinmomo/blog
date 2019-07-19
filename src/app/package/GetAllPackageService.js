"use strict"
const Operation = require('../../Operation.js');

class GetAllPackageService extends Operation {
    constructor(usersRepository) {
        super();
        this.usersRepository = usersRepository;
    }

    async execute(...args) {
        const { SUCCESS, ERROR, NOT_FOUND } = this.outputs;

        try {
            const services = await this.usersRepository.getServices(...args);
            if (!services.length) {
                return this.emit(NOT_FOUND, {
                    type: 'PackageNotFound.',
                    details: `Package can't be found.`
                });
            } else {
                if (!services[0].services.length) {
                    return this.emit(NOT_FOUND, {
                        type: 'ServiceNotFound.',
                        details: `Service can't be found.`
                    });
                 }
                this.emit(SUCCESS, services[0].services);
            }
        } catch (error) {
            if (error.message === 'NotFoundError') {
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

GetAllPackageService.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = GetAllPackageService;
