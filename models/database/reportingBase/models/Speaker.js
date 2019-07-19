module.exports = function(sequelize, DataTypes) {
    const Speaker = sequelize.define('AM_speaker',
            {
                idx: {type : DataTypes.INTEGER,  autoIncrement: true},
                userId: {type : DataTypes.STRING, primaryKey: true},
                deviceId: DataTypes.STRING,
                serialNo: DataTypes.STRING,
                partNo: DataTypes.STRING,
                description: DataTypes.STRING,
                activatedDatetime: {type : DataTypes.STRING, primaryKey: true},
                reportedAt: DataTypes.DATE
            },
            {
                timestamps: false,
            }
);
    return Speaker;
};
