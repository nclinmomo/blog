var OrderDBModel = require('../models').order_log;

class SequelizexxxRepository {

    constructor(OrderDBModel) {
        this.OrderDBModel = OrderDBModel;
    }
}

module.exports = new SequelizexxxRepository(OrderDBModel);