const Operation = require('../../Operation.js');

class GetAllServices extends Operation {
    constructor(usersRepository) {
        super();
        this.usersRepository = usersRepository;
    }

    async execute(...args) {
        const { SUCCESS, ERROR, NOT_FOUND } = this.outputs;

        try {
            const services = await this.usersRepository.getAll(...args);
            this.emit(SUCCESS, services);
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

GetAllServices.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = GetAllServices;
