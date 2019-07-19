const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const mLogger = require('../configs/logger').log4js.getLogger('models/index');
const sequelize = require('../configs/mysqlConnection');
let db = {};

// load models
fs.readdirSync(__dirname).filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    }).forEach(function (file) {
        mLogger.info(path.join(__dirname, file))
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
        mLogger.warn(db)
});

Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;