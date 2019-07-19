const fs = require('fs');
const parse = require('csv-parse');
const transform = require('stream-transform');


module.exports = class CsvReaderService {
    constructor(reqFile) {
        this.file = reqFile;
    }

    async read() {
        const self = this;

        return new Promise(function (resolve, reject) {
            var output = [];
            var parser = parse({delimiter: ',' })
            var input = fs.createReadStream(this.file, {encoding:'utf-8'});
            var transformer = transform(function(record, callback){
                setTimeout(function(){
                    callback(null, record.join(' ')+'\n');
                }, 500);
            }, {parallel: 10});
            //input.pipe(parser).pipe(transformer).pipe(process.stdout);

            input.pipe(parse({delimiter: ',', columns: true}, function (err, data) {
                if (err) {
                    return reject(new Error('ParseError'));
                }
                resolve(null, data);
            }));
        });
    }

}