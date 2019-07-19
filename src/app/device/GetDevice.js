const Operation = require('../../Operation.js');

class GetDevice extends Operation {
    constructor(usersRepository) {
        super();
        this.usersRepository = usersRepository;
    }

    async execute(deviceId) {
        const { SUCCESS, ERROR, NOT_FOUND } = this.outputs;

        try {
            const device = await this.usersRepository.getById(deviceId);
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

GetDevice.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = GetDevice;
