const Operation = require('../../Operation.js');

class GetAllActivationRecords extends Operation {
    constructor(usersRepository) {
        super();
        this.usersRepository = usersRepository;
    }

    async execute(query) {
        const { SUCCESS, ERROR } = this.outputs;

        try {
            let records = await this.usersRepository.getActivation(query);
            this.emit(SUCCESS, records);
        } catch (error) {
            this.emit(ERROR, error);
        }
    }
}

GetAllActivationRecords.setOutputs(['SUCCESS', 'ERROR']);

module.exports = GetAllActivationRecords;