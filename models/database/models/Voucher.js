'use strict';

module.exports = function(sequelize, DataTypes) {
    const Voucher = sequelize.define('voucher',
            {
                voucherId: {type : DataTypes.STRING, primaryKey: true},
                type: DataTypes.STRING,
                name: DataTypes.STRING,
                description: DataTypes.STRING
            });

    Voucher.associate = function (models) {
        Voucher.belongsToMany(models.package,  {through: models.package_voucher, foreignKey: 'voucherId'}) // foreignKey[type] is voucher's key
    }
    return Voucher;
};
