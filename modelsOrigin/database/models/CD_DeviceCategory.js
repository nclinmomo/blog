'use strict';

module.exports = function(sequelize, DataTypes) {
    const DeviceCategory = sequelize.define('CD_device_category',
            {
                deviceCatgId: {type : DataTypes.STRING, primaryKey: true},
                deviceCatgName: DataTypes.STRING,
            });
    DeviceCategory.associate = function (models) {
        DeviceCategory.hasMany(models.device, {foreignKey: 'deviceCatgId'}) // foreignKey[deviceCatgId] is device's key
    }
    return DeviceCategory;
};