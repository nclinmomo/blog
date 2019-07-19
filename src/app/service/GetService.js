const Operation = require('../../Operation.js');

class GetService extends Operation {
    constructor(usersRepository) {
        super();
        this.usersRepository = usersRepository;
    }

    async execute(serviceId) {
        const { SUCCESS, ERROR, NOT_FOUND } = this.outputs;

        try {
            const service = await this.usersRepository.getById(serviceId);
            this.emit(SUCCESS, service);
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

GetService.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = GetService;
