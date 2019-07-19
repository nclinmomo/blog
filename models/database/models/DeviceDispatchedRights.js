module.exports = function(sequelize, DataTypes) {
    const DeviceRights = sequelize.define('devices_dispatched_right',
            {
                idx : {type : DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
                deviceId : {type : DataTypes.STRING},
                packageId : DataTypes.STRING,
                userId : DataTypes.STRING,
                status : DataTypes.STRING,
                createdAt: DataTypes.DATE,
                updatedAt: DataTypes.DATE
            },
            {
                timestamps: false,
            });
    DeviceRights.associate = function (models) {
        DeviceRights.belongsTo(models.CD_devices_dispatched_rights_status, {foreignKey: 'status'}); // foreignKey[status] is DeviceRights's key
    }
    return DeviceRights;
};
