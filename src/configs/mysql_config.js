process.env = {};
process.env.TEST_ACCOUNTS_FILE_PATH = 'C:\\work\\vagrant\\test\\vm_centos_7_public_docker_registry\\service-activation-management\\tests';
process.env.MYSQL_HOST='192.168.33.10';
process.env.MYSQL_PORT='3306';
process.env.MYSQL_USER='iamactmanagement';
process.env.MYSQL_PASSWORD='Workeractm168';
process.env.MYSQL_DATABASE='activation_management';
process.env.LIMITED_TIME_OFFER_ENABLED='false';
process.env.LIMITED_TIME_OFFER_START_TIME='2019-07-18';
process.env.LIMITED_TIME_OFFER_END_TIME='2019-07-18';

module.exports = {
    "connectionLimit" : 15,
    "host"     :  process.env.MYSQL_HOST,
    "port"     :  process.env.MYSQL_PORT,
    "user"     :  process.env.MYSQL_USER,
    "password" :  process.env.MYSQL_PASSWORD,
    "database" :  process.env.MYSQL_DATABASE,
    "dialect"  :  "mysql",
    "logging": false,
    "operatorsAliases": false,
    "pool" : {
        "max"  : 20,
        "min"  : 5,
        "idle" : 10000
    },
    "dialectOptions" : {
        "multipleStatements" : true
    },
    "timezone": '+08:00'
};
