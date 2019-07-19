const schedule = require('node-schedule');
const Operation = require('../Operation.js');
const moment = require('moment');
const mLogger = require('../../helpers/logger').log4js.getLogger('src/ReportingService');
/**
 * 1. Get raw data from activation_management
 * 2. Set timer and update data to reporting_base
 */
class ReportingService extends Operation {

    constructor(sourceRepository, targetRepository) {
        super();
        this.sourceRepository = sourceRepository;
        this.targetRepository = targetRepository;
        this.lastDateActivatedDate = null;
        this.nowDate = null;
    }

    async exec(cronConfig) {
        const self = this;
        if (cronConfig) {
            mLogger.info('set timer')
            var j = schedule.scheduleJob(cronConfig, function(fireDate) {
                mLogger.info('This job was supposed to run at ' + fireDate + ', but actually ran at ' + new Date());
                self.reportSpeakerInfo(null, moment(Date.now()).format("YYYY-MM-DD"));
            });
        } else {
            self.reportSpeakerInfo();
        }
    }

    async triggerReportingJob(startDatetime, endDatetime) {
        this.reportSpeakerInfo(startDatetime, endDatetime);
    }

    async reportSpeakerInfo(startDatetime, endDatetime) {
        mLogger.info('[Reporting infomation] Prepare reporting job...');
        const { SUCCESS, ERROR, NO_DATA } = this.outputs;
        try {
            this.nowDate = (endDatetime) ? endDatetime : moment(Date.now()).format("YYYY-MM-DDTHH:mm:ss");
            const lastActivatedDate = await this.targetRepository.getLastActivatedDate();
            this.lastDateActivatedDate = (startDatetime) ? startDatetime : lastActivatedDate;
            if ((startDatetime) && moment(startDatetime).isAfter(lastActivatedDate)) {
                mLogger.info(`[Reporting infomation] The startDatetime is after the lastActivatedDate, use lastActivatedDate ${lastActivatedDate} instead startDatetime`)
                this.lastDateActivatedDate = lastActivatedDate;
            }

            const reportingData = await this.sourceRepository.getAllByCreatedTime(this.lastDateActivatedDate, this.nowDate);
            const newReportingDate = await this.targetRepository.add(reportingData);
            this.emit(SUCCESS);
        } catch (error) {
            if (error.message === "NotFoundError") return this.emit(NO_DATA, error);
            this.emit(ERROR, error);
        }
    }
}

ReportingService.setOutputs(['SUCCESS', 'ERROR', 'NO_DATA']);
module.exports = ReportingService;
