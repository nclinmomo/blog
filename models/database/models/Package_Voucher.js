'use strict';

module.exports = function(sequelize, DataTypes) {

   const PackageVoucher = sequelize.define('package_voucher',
            {
                idx: DataTypes.INTEGER,
                packageId: DataTypes.STRING,
                voucherId: DataTypes.STRING,
            }, { freezeTableName: true });

    return PackageVoucher;
};