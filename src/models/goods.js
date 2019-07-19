// const db = require('../configs/mysqlConnection');
// const Sequelize = require('sequelize');

// const goods = db.define('GOODS',{
//     "GOODS_CODE": {
//         "type": Sequelize.INTEGER
//     },    
//     "GOODS_NAME": {
//         "type": Sequelize.STRING
//     },
//     "INSERT_DATE": {
//         "type": 'TIMESTAMP'
//     },
//     "UPDATE_DATE": {
//         "type": 'TIMESTAMP'
//     }
// }, {
//     timestamps: false,
//     tableName: 'GOODS'
// });
// goods.removeAttribute('id');

// module.exports = goods;


module.exports = function(sequelize, DataTypes) {
    const GOODS = sequelize.define('GOODS',
        {
            GOODS_CODE: DataTypes.INTEGER,
            GOODS_NAME: DataTypes.STRING
        },
        {
            timestamps: false,
            tableName: 'GOODS'
        });
    return GOODS;
};
