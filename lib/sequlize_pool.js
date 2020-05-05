const Sequelize = require('sequelize');

let _sequelize;

let NND = {};

NND.init = function(app){
    const config = app.get('database');
    _sequelize = new Sequelize(config.database, config.user, config.password, {
        host: config.host,
        dialect: 'mysql',
        operatorsAliases: false,
        timestamps: false,
        logging: false,
        pool: {
            max: 5,
            min: 2,
            idle: 10000
        },
        timezone: '+09:00'
    });
    return _sequelize;
};

var sequlize_pool = module.exports;

sequlize_pool.init = function(app) {
    if (!!_sequelize){
        return sequlize_pool;
    } else {
        NND.init(app);
        sequlize_pool.sequelize = _sequelize;
        return sequlize_pool;
    }
};