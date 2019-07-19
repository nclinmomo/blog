'use strict'
const mUtils = require('../../../helpers/utils');
const ServiceMapper = require('./SequelizeServiceMapper');
class SequelizeServicesRepository {
    constructor(Service) {
        this.ServiceModel = Service;
    }

    async getAll(...args) {
        try {
            return await this.ServiceModel.findAll({ where : args, rejectOnEmpty: true });
        } catch (error) {
            if (error.name === 'SequelizeEmptyResultError') {
                const notFoundError = new Error('NotFoundError');
                notFoundError.type = 'serviceNotFound';
                notFoundError.details = `Service with ${JSON.stringify(args)} can't be found.`;

                throw notFoundError;
            }
            throw error;
        }
    }

    async getById(serviceId) {
        const services = await this.getInfoById(serviceId);
        return services;
    }

    async add(service) {
        try {
            const newService = await this.ServiceModel.create(ServiceMapper.toDatabase(service));
            return ServiceMapper.toEntity(newService);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                const duplicateError = new Error('DuplicateError');
                duplicateError.details = `[ ${error.errors[0].type} ] Service with ${error.errors[0].value} can't be add.`;
                throw duplicateError;
            }
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                const validationError = new Error('ValidationError');
                //notFoundError.details = `Device with id ${deviceId} can't be found.`;  //TODO: detail??
                //validationError.details = error.message;
                throw validationError;
            }
            throw error;
        }
    }

    async deleteById(serviceId) {
        const device = await this.getInfoById(serviceId);
        await device.destroy();
        return;
    }

    // Private
    async getInfoById(serviceId) {
        try {
            return await this.ServiceModel.findById(serviceId, { rejectOnEmpty: true });
        } catch(error) {
            if (error.name === 'SequelizeEmptyResultError') {
                const notFoundError = new Error('NotFoundError');
                notFoundError.details = `Service with id ${serviceId} can't be found.`;

                throw notFoundError;
            }
            throw error;
        }
    }
}
module.exports = SequelizeServicesRepository;