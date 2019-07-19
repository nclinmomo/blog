const Operation = require('../../Operation.js');

class GetAllRecords extends Operation {
    constructor(usersRepository) {
        super();
        this.usersRepository = usersRepository;
    }

    async execute(query) {
        const { SUCCESS, ERROR } = this.outputs;

        try {
            let records = query ? await this.usersRepository.getAll(query) : await this.usersRepository.getAll();
            this.emit(SUCCESS, records);
        } catch(error) {
            this.emit(ERROR, error);
        }
    }
}

GetAllRecords.setOutputs(['SUCCESS', 'ERROR']);

module.exports = GetAllRecords;
