const ReportingSpeakerMapper = require('./SequelizeReportingMapper');
class SequelizeReportingRepository {
    constructor(SpeakerDBModel) {
        this.SpeakerDBModel = SpeakerDBModel;
    }

    // async getAll(...args) {
    //     const records = await this.RecordModel.findAll({ where : args, rejectOnEmpty: true, raw : true});
    //     return records;
    // }
    async getLastActivatedDate() {
        try {
            return await this.SpeakerDBModel.max('activatedDatetime');
        } catch (error) {
            throw error;
        }
    }

    async add(data) {
        try {
            return await this.SpeakerDBModel.bulkCreate(ReportingSpeakerMapper.toDatabase(data),
                    {
                        ignoreDuplicates : true
                    }
                );
        } catch (error) {
            throw error;
        }
    }
}
module.exports = SequelizeReportingRepository;