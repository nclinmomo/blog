module.exports = function(sequelize, DataTypes) {
    const DeviceRightsStatus = sequelize.define('CD_devices_dispatched_rights_status',
            {
                status: {type : DataTypes.INTEGER, primaryKey: true},
                description: DataTypes.STRING,
            },
            {
                freezeTableName: true
            }
        );
    DeviceRightsStatus.associate = function (models) {
        DeviceRightsStatus.hasMany(models.devices_dispatched_right, {foreignKey: 'status'}) // foreignKey[status] is devices_dispatched_right's key
    }
    return DeviceRightsStatus;
};