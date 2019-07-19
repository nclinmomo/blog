'use strict';

module.exports = function(sequelize, DataTypes) {
    const Service = sequelize.define('service',
            {
                sdpProductId: {type : DataTypes.STRING, primaryKey: true},
                sdpPartnerId: DataTypes.STRING,
                productName: DataTypes.STRING
            });

    Service.associate = function (models) {
        Service.belongsToMany(models.package,  {through: models.package_service, foreignKey: 'sdpProductId'}) // foreignKey[packageId] is service's key
    }
    return Service;
};
