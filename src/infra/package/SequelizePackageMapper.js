const Package = require('../../../models/domain/models/Package');

const SequelizePackageMapper = {
    toEntity({ dataValues }) {
      return new Package(dataValues);
    },

    toDatabase(package) {
      return package;
    }
};

module.exports = SequelizePackageMapper;
