require('dotenv').config({path: '.env'});
const ENV = process.env;
const CTI_ENV = ENV.CTI_ENV || 'default';
const config = require(`./environment/_${CTI_ENV}`);

/**
 * CTI環境設定
 * @type {CtiEnvironment}
 */
module.exports = class CtiEnvironment {
    /**
     * S3のID取得
     * @return {string}
     */
    static get S3_BUCKET() {
        return config.S3_BUCKET;
    }
};