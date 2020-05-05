const crypto = require('crypto');
const moment = require("moment");

module.exports = function(sequelize, DataTypes) {
    const User = sequelize.define('user', {
        id: {
            type: DataTypes.BIGINT(20),
            allowNull: false,
            autoIncrement: true,
            initialAutoIncrement: 1,
            primaryKey: true
        },
        login_id: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            get() {
                return this.getDataValue('password');
            },
            set(password) {
                const salt = crypto.createHash('md5').update(Math.random().toString()).digest('hex');
                this.setDataValue('password_salt', salt);
                this.setDataValue('password', this.encryptPassword(password));
            },
            allowNull: false
        },
        password_salt: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
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

    User.schema("public");

    const md5_data = (password, salt) => {
        let data = password;
        if (!!salt) {
            data = data + "_" + salt;
        }
        return crypto.createHash("md5").update(data).digest('hex');
    };

    User.prototype.encryptPassword = function(password) {
        return md5_data(password, this.get('password_salt'));
    };

    User.prototype.validPassword = function (password) {
        return this.encryptPassword(password) === this.get('password');
    };

    User.sync({force: false, logging:false}).then(function () {

    });

    return User;
};
