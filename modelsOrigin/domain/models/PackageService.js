const t = require('tcomb');

// Define Package Service structure
const PackageService = t.struct({
    packageId: t.String,
    sdpProductId: t.String,
    createdAt: t.maybe(t.Date),
    updatedAt: t.maybe(t.Date)
}, "Package");


module.exports = PackageService;