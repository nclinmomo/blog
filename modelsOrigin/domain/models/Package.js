const t = require('tcomb');

// Define Package structure
const Package = t.struct({
    packageId: t.maybe(t.String),
    packageName: t.String,
    description: t.String,
    createdAt: t.maybe(t.Date),
    updatedAt: t.maybe(t.Date)
}, "Package");


module.exports = Package;