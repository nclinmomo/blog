const t = require('tcomb');

var invalidTimestamp = function (timestamp) {
    return mMoment(timestamp, 'X').isValid();
};

// Define Device structure
const Device = t.struct({
    deviceId: t.maybe(t.String),
    macAddr: t.String,
    partNo: t.String,
    serialNo: t.String,
    modelName: t.maybe(t.String),
    deviceCatgId: t.String,
    userId: t.maybe(t.String),
    packageId: t.maybe(t.String),
    createdAt: t.maybe(t.Date),
    updatedAt: t.maybe(t.Date)
}, "Device");


module.exports = Device;