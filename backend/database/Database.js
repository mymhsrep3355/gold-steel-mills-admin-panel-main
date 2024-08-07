const { Sequelize } = require('sequelize');
class Database{
    static sequelize ;
    constructor(config) {
            Database.sequelize = new Sequelize(config.dbName, config.userName, config.password, {
                host: config.host,
                port:config.port,
                dialect: config.dialect
            });

    }
}

module.exports={Database}

