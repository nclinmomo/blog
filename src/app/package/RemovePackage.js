'use strict'
const Operation = require('../../Operation.js');

class RemovePackage extends Operation {
    constructor(usersRepository) {
        super();
        this.usersRepository = usersRepository;
    }

    async execute(packageId) {
        const { SUCCESS, ERROR, NOT_FOUND } = this.outputs;

        try {
            const packageResult = await this.usersRepository.deleteById(packageId);
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

RemovePackage.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = RemovePackage;
