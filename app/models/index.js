const sequelize = require('../../lib/sequlize_pool').sequelize;
const db = {};

db.User = sequelize.import('./user');
db.UserImage = sequelize.import('./user_image');

Object.keys(db).forEach(function(modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;