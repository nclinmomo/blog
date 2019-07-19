'use strict';

module.exports = function(sequelize, DataTypes) {
    const UserVoucher = sequelize.define('user_voucher',
            {
                idx: DataTypes.INTEGER,
                code: {type : DataTypes.STRING, primaryKey: true},
                userId: DataTypes.STRING,
                deviceSerialNo: DataTypes.STRING,
                voucherId: DataTypes.STRING,
                packageId: DataTypes.STRING,
                status: DataTypes.BOOLEAN,
                redeemedService: DataTypes.STRING
            },
            {
                freezeTableName: true,
                timestamps: false
            });
    UserVoucher.associate = function (models) {
        UserVoucher.belongsTo(models.package, {foreignKey: 'packageId'}); // foreignKey[packageId] is device's key
        UserVoucher.belongsTo(models.voucher, {foreignKey: 'voucherId'}); // foreignKey[packageId] is device's key
    }
    return UserVoucher;
};
