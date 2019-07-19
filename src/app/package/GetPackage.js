"use strict"
const Operation = require('../../Operation.js');

class GetPackage extends Operation {
    constructor(usersRepository) {
        super();
        this.usersRepository = usersRepository;
    }

    async execute(packageId) {
        const { SUCCESS, ERROR, NOT_FOUND } = this.outputs;

        try {
            const packageResult = await this.usersRepository.getById(packageId); // package is reserved word, use packageResult instead.
            this.emit(SUCCESS, packageResult);
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

GetPackage.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = GetPackage;
