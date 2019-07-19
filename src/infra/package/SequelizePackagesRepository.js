'use strict'
const mUtils = require('../../../helpers/utils');
const PackageMapper = require('./SequelizePackageMapper');
const ServiceModel = require('../../../models/database/models').service;
const VoucherModel = require('../../../models/database/models').voucher;
const PackageServiceModel = require('../../../models/database/models').package_service;
class SequelizePackagesRepository {
    constructor(Package) {
        this.PackageModel = Package;
    }

    async getAll(...args) {
        try {
            return await this.PackageModel.findAll({ where : args, rejectOnEmpty: true });
        } catch (error) {
            if (error.name === 'SequelizeEmptyResultError') {
                const notFoundError = new Error('NotFoundError');
                notFoundError.details = `Package can't be found.`;

                throw notFoundError;
            }
            throw error;
        }
    }

    async getById(packageId) {
        const packages = await this.getInfoById(packageId);
        return packages;
    }

    async add(packageData) {
        try {
            const newPackage = await this.PackageModel.create(PackageMapper.toDatabase(packageData));
            return PackageMapper.toEntity(newPackage);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                const duplicateError = new Error('DuplicateError');
                duplicateError.details = `[ ${error.errors[0].type} ] Package with ${error.errors[0].value} can't be add.`;
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

    async deleteById(packageId) {
        const packageData = await this.getInfoById(packageId);
        await packageData.destroy();
        return;
    }

    // Private
    async getInfoById(packageId) {
        try {
            return await this.PackageModel.findById(packageId, { rejectOnEmpty: true });
        } catch(error) {
            if (error.name === 'SequelizeEmptyResultError') {
                const notFoundError = new Error('NotFoundError');
                notFoundError.details = `Package with id ${packageId} can't be found.`;

                throw notFoundError;
            }
            throw error;
        }
    }

    async getService(alias, ...args) {
        try {
            return await this.PackageModel.findOne(
                {
                    where : args,
                    raw: true,
                    include : [
                        {
                            model: ServiceModel,
                            through: {
                                attributes: ['packageId'],
                                where: {
                                    necessary: false,
                                    alias
                                },
                                raw: true
                            }
                        }
                    ]
                });
        } catch (error) {
            throw error;
        }
    }

    async getServices(...args) {
        try {
            return await this.PackageModel.findAll(
                {
                    where : args,
                    include : [
                        {
                            model: ServiceModel,
                            through: {
                                attributes: ['packageId'],
                                where: {
                                    necessary: true
                                }
                            }
                        }
                    ]
                });
        } catch (error) {
            if (error.name === 'SequelizeEmptyResultError') {
                const notFoundError = new Error('NotFoundError');
                notFoundError.details = `Package can't be found.`;

                throw notFoundError;
            }
            throw error;
        }
    }

    async getNotNecessaryServices(...args) {
        try {
            return await this.PackageModel.findAll(
                {
                    where : args,
                    include : [
                        {
                            model: ServiceModel,
                            through: {
                                attributes: ['packageId', 'alias', 'displayName'],
                                where: {
                                    necessary: false
                                }
                            }
                        }
                    ]
                });
        } catch (error) {
            if (error.name === 'SequelizeEmptyResultError') {
                const notFoundError = new Error('NotFoundError');
                notFoundError.details = `Package can't be found.`;

                throw notFoundError;
            }
            throw error;
        }
    }

    async getVouchers(...args) {
        try {
            return await this.PackageModel.findAll(
                {
                    where : args,
                    raw : true,
                    include : [
                        {
                            model: VoucherModel,
                            through: {
                                attributes: []
                            }
                        }
                    ]
                });
        } catch (error) {
            if (error.name === 'SequelizeEmptyResultError') {
                const notFoundError = new Error('NotFoundError');
                notFoundError.details = `Voucher can't be found.`;

                throw notFoundError;
            }
            throw error;
        }
    }

    async addService(packageId, sdpProductId) {
        try {
            const packageData = await this.getInfoById(packageId);
            const packages = await packageData.addService(sdpProductId);
            if (!packages.length) {
                const duplicateError = new Error('DuplicateError');
                throw duplicateError;
            }
            return packages;
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                const duplicateError = new Error('DuplicateError');
                duplicateError.details = `[ ${error.errors[0].type} ] Package with ${error.errors[0].value} can't be add.`;
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

    async deleteService(packageId, sdpProductId) {
        return await PackageServiceModel.destroy(
            {
                where : {
                    packageId,
                    sdpProductId
                }
            }
        );
    }
}
module.exports = SequelizePackagesRepository;