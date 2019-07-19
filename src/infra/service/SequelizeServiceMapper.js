const Service = require('../../../models/domain/models/Service');

const SequelizeDeviceMapper = {
    toEntity({ dataValues }) {
      return new Service(dataValues);
    },

    toDatabase(service) {
      return service;
    }
};

module.exports = SequelizeDeviceMapper;
