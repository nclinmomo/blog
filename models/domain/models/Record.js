const t = require('tcomb');


// Define Device structure
const Record = t.struct({
    deviceId: t.String,
    macAddr: t.String,
    partNo: t.String,
    serialNo: t.String,
    userId: t.String,
    createdAt: t.maybe(t.Date),
    updatedAt: t.maybe(t.Date)
}, "Record");


module.exports = Record;