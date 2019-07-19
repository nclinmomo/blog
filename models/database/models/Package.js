'use strict';

module.exports = function(sequelize, DataTypes) {
    const Package = sequelize.define('package',
            {
                packageId: {type : DataTypes.STRING, primaryKey: true},
                packageName: DataTypes.STRING,
                description: DataTypes.STRING,
            });

    Package.associate = function (models) {
        Package.hasMany(models.device, {foreignKey: 'packageId'}) // foreignKey[packageId] is device's key
        Package.belongsToMany(models.service, {through: models.package_service, foreignKey: 'packageId', otherKey: 'sdpProductId'}) // foreignKey[packageId] is service's key
        Package.belongsToMany(models.voucher, {through: models.package_voucher, foreignKey: 'packageId', otherKey: 'voucherId'}) // foreignKey[voucherId] is voucher's key
    }
    return Package;
};