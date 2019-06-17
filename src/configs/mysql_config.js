module.exports = {
    "host"     :  'localhost',
    "port"     :  '3306',
    "user"     :  'root',
    "password" :  '12345',
    // "database" :  'my_db',
    "dialect"  :  "mysql",
    "logging": false,
    "operatorsAliases": false,
    "pool" : {
        "max"  : 10,
        "min"  : 5,
        "idle" : 10000
    },
    // "dialectOptions" : {
    //     "multipleStatements" : true
    // },
    "timezone": '+08:00'
};