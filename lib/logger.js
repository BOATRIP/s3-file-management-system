var log4js = require('log4js');
log4js.configure(__dirname + '/../config/log4js.json');
exports.getLogger = function(category){
    return log4js.getLogger(category);
};
