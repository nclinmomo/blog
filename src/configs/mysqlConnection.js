const Sequelize = require('sequelize');
const OPTIONS = require('./mysql_config');
const mSequelize = new Sequelize('activation_management', 'iamactmanagement' , 'Workeractm168', OPTIONS);
    mSequelize
    .authenticate()
    .then(() => {
        // mLogger.info('Connection has been established successfully.');
        console.log('test111');
    })
    .catch(err => {
        // mLogger.error('Unable to connect to the database:', err);
        console.log('test111');
    });

module.exports = mSequelize;