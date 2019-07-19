'use strict';

module.exports = function(sequelize, DataTypes) {
    const Record = sequelize.define('record',
            {
                recordIdx: {type : DataTypes.INTEGER, primaryKey: true},
                deviceId: DataTypes.STRING,
                macAddr: DataTypes.STRING,
                serialNo: DataTypes.STRING,
                partNo: DataTypes.STRING,
                userId: DataTypes.STRING,
                description: DataTypes.STRING,
                createdAt: DataTypes.DATE,
                updatedAt: DataTypes.DATE
            },
            {
                timestamps: false,
            });
    return Record;
};
