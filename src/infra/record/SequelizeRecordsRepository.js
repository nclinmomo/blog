'use strict'
const t = require('tcomb-validation');
const mModel_validation = require('../../../models/domain/models/Service')
const RecordMapper = require('./SequelizeRecordMapper');
//const Device = require('../../domain/models/Device');
const mUtils = require('../../../helpers/utils');
class SequelizeRecordsRepository {
    constructor(Record) {
        this.RecordModel = Record;
    }

    async getAll(...args) {
        const records = await this.RecordModel.findAll({ where : args, raw : true});
        return records;
    }

    async getAllByCreatedTime(minDate, maxDate) {
        try {
            const records = await this.RecordModel.findAll(
                {
                    where : {
                        createdAt : {
                            [this.RecordModel.sequelize.Op.gt]: minDate,
                            [this.RecordModel.sequelize.Op.lte]: maxDate
                        }
                },
                rejectOnEmpty: true, raw : true}
            );
            return records;
        } catch (error) {
            if (error.name === 'SequelizeEmptyResultError') {
                const notFoundError = new Error('NotFoundError');
                notFoundError.type = 'reocrdNotFound';

                throw notFoundError;
            }
            throw error;
        }
    }

    async add(device, reason) {
        try {
            const newDevice = await this.RecordModel.create(RecordMapper.toDatabase(device, reason));
            return RecordMapper.toEntity(newDevice);
        } catch (error) {
            throw error;
        }
    }

    async getActivation(query) {
        try {
            const records = await this.RecordModel.findAll({
                attributes: ['deviceId', 'macAddr', 'serialNo', 'partNo', 'userId', 'description', 'createdAt', 'updatedAt'],
                where : {
                    'userId': query.userId,
                    [this.RecordModel.sequelize.Op.or] : [
                        {description: 'Activation successful.'},
                        {description: 'Returned'},
                        {description: 'Corrected for misusage'}
                    ]               
                }, 
                raw : true
            });
            return records;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = SequelizeRecordsRepository;