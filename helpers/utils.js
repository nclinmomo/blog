var crypto = require('crypto');
const fs = require('fs');
const parse = require('csv-parse');
const transform = require('stream-transform');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateDeviceId() {
    var seed = Date.now() + getRandomInt(1, 10).toString() + getRandomInt(1, 10).toString() +
            getRandomInt(1, 10).toString();
    return 'default-'+ crypto.createHash('md5').update(seed).digest("hex");
}

function generatePackageId() {
    return 'PACKAGE' + Date.now();
}

async function csvParser(file) {
    return new Promise(function (resolve, reject) {
        var output = [];
        var parser = parse({delimiter: ',' })
        var input = fs.createReadStream(file, {encoding:'utf-8'});;

        input.pipe(parse({delimiter: ',', columns: true}, function (err, data) {
            if (err) {
                return reject(new Error('ParseError'));
            }
            resolve(data);
        }));
    });
}

exports.generateDeviceId = generateDeviceId;
exports.generatePackageId = generatePackageId;
exports.csvParser = csvParser;