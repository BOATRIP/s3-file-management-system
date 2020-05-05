const moment = require("moment");

module.exports = function (sequelize, DataTypes) {
    const UserImage = sequelize.define('user_image', {
        id: {
            type: DataTypes.BIGINT(20),
            allowNull: false,
            autoIncrement: true,
            initialAutoIncrement: 1,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.BIGINT(20),
            unique: true,
            allowNull: false
        },
        image: {
            type: DataTypes.BLOB,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        updated_at: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    }, {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    UserImage.associate = (model) => {
        UserImage.belongsTo(model.User, {foreignKey: 'user_id'});
    };

    UserImage.schema("public");

    UserImage.sync({force: false, logging: false}).then(function () {

    });

    return UserImage;
};

