var express = require('express');
var router = express.Router();

// var db = require('../src/configs/mysqlConnection');
// const Sequelize = require('sequelize');

const goods = require('../src/models/goods');

/* GET home page. */
router.get('/', function(req, res, next) {

  // db.authenticate()
  //   .then(() => console.log('Database connected...'))
  //   .catch(err => console.log(err));


  // db.define('GOODS',{
  //   GOODS_CODE: {
  //     type: Sequelize.INTEGER
  //   }
  // })
  goods.findOne({
    where: {
      GOODS_CODE: '2'
    }
  })
    .then(goods => console.log(goods))
    .catch(err => console.log(err));
    
  res.render('index', { title: 'Express' });
});

module.exports = router;
