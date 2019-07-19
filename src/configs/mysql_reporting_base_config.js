module.exports = {
    "connectionLimit" : 15,
    "host"     :  process.env.MYSQL_HOST,
    "port"     :  process.env.MYSQL_PORT,
    "user"     :  process.env.MYSQL_REPORTING_BASE_USER,
    "password" :  process.env.MYSQL_REPORTING_BASE_PASSWORD,
    "database" :  process.env.MYSQL_DATABASE_REPORTING_BASE,
    "dialect"  :  "mysql",
    "logging": false,
    "operatorsAliases": false,
    "pool" : {
        "max"  : 10,
        "min"  : 0,
        "idle" : 10000
    },
    "dialectOptions" : {
        "multipleStatements" : true
    },
    "timezone": '+08:00'
};
