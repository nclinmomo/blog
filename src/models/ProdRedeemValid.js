module.exports = function(sequelize, DataTypes) {
    const ProdRedeemValid = sequelize.define('product_redeem_validate',
        {
            sdpProductId: {type : DataTypes.STRING, primaryKey: true},
            redeemCode : DataTypes.STRING
        },
        {
            timestamps: false,
            tableName: 'product_redeem_validate'
        });
    return ProdRedeemValid;
};
