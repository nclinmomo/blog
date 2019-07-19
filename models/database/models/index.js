const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const mLogger = require('../../../helpers/logger.js').log4js.getLogger('database/models/index');
//const OPTIONS = (process.env.NODE_ENV === 'production') ? require('../../../configs/mysql_production_config.json')
  //      : require('../../../configs/mysql_debug_config.json');
const OPTIONS = require('../../../configs/mysql_config');
let db = {};
const mSequelize = new Sequelize(OPTIONS.database, OPTIONS.user , OPTIONS.password, OPTIONS);
    mSequelize
    .authenticate()
    .then(() => {
        mLogger.info('Connection has been established successfully.');
    })
    .catch(err => {
        mLogger.error('Unable to connect to the database:', err);
    });

// load models
fs.readdirSync(__dirname).filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    }).forEach(function (file) {
        mLogger.info(path.join(__dirname, file))
        var model = mSequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
        mLogger.warn(db)
});

Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = mSequelize;
db.Sequelize = Sequelize;

module.exports = db;