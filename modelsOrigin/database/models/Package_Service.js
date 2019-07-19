'use strict';

module.exports = function(sequelize, DataTypes) {

   const PackageService = sequelize.define('package_service',
            {
                idx: DataTypes.INTEGER,
                necessary: DataTypes.BOOLEAN,
                alias: DataTypes.STRING,
                displayName: DataTypes.STRING
            }, { freezeTableName: true });

    return PackageService;
};