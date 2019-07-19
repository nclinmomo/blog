"use strict"
const Operation = require('../../Operation.js');

class GetAllPackages extends Operation {
    constructor(usersRepository) {
        super();
        this.usersRepository = usersRepository;
    }

    async execute() {
        const { SUCCESS, ERROR, NOT_FOUND } = this.outputs;

        try {
            const packages = await this.usersRepository.getAll();
            this.emit(SUCCESS, packages);
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

GetAllPackages.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = GetAllPackages;
