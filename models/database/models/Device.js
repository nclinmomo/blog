'use strict';

module.exports = function(sequelize, DataTypes) {
    const Device = sequelize.define('device',
            {
                deviceId: {type : DataTypes.STRING},
                macAddr: {type : DataTypes.STRING, primaryKey: true},
                partNo: {type : DataTypes.STRING, primaryKey: true},
                serialNo: {type : DataTypes.STRING, primaryKey: true},
                modelName: DataTypes.STRING,
                deviceCatgId : DataTypes.INTEGER,
                packageId : {type: DataTypes.STRING, allowNull: true},
                currentUserId : {type: DataTypes.STRING, allowNull: true},
                createdAt: DataTypes.DATE,
                updatedAt: DataTypes.DATE
            },
            {
                timestamps: false,
            });
    Device.associate = function (models) {
        Device.belongsTo(models.package, {foreignKey: 'packageId'}); // foreignKey[packageId] is device's key
        Device.belongsTo(models.CD_device_category, {foreignKey: 'deviceCatgId'}); // foreignKey[packageId] is device's key
    }
    return Device;
};
