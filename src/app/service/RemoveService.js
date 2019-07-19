const Operation = require('../../Operation.js');

class RemoveService extends Operation {
    constructor(usersRepository) {
        super();
        this.usersRepository = usersRepository;
    }

    async execute(deviceId) {
        const { SUCCESS, ERROR, NOT_FOUND } = this.outputs;

        try {
            const device = await this.usersRepository.deleteById(deviceId);
            this.emit(SUCCESS, device);
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

RemoveService.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = RemoveService;
