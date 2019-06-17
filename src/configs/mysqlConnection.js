const Sequelize = require('sequelize');
const OPTIONS = require('./mysql_config');
const mSequelize = new Sequelize('my_db', 'root' , '12345', OPTIONS);
    mSequelize
    .authenticate()
    .then(() => {
        // mLogger.info('Connection has been established successfully.');
        console.log('test111');
    })
    .catch(err => {
        // mLogger.error('Unable to connect to the database:', err);
    });

module.exports = mSequelize;