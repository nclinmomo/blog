const t = require('tcomb');

// Define Service structure
const Service = t.struct({
    sdpProductId: t.String,
    sdpPartnerId: t.String,
    productName: t.String,
    createdAt: t.maybe(t.Date),
    updatedAt: t.maybe(t.Date)
}, "Service");

module.exports = Service;