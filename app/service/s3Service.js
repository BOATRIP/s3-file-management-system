// imports
require('dotenv').config();
const CTI_ENV = require('../../config/cti/CtiEnvironment');
const AWS = require('aws-sdk');
AWS.config.update({region: 'ap-northeast-1'});
const s3Client = new AWS.S3({maxRetries: 5});

/**
 * S3のオブジェクト一覧取得
 * @param {String} prefix
 * @return {Promise<S3.ListObjectsV2Output & {$response: Response<S3.ListObjectsV2Output, AWSError>}>}
 */
exports.fetchObjectList = async(prefix) => {
    let PARAMS = {
        Bucket: CTI_ENV.S3_BUCKET,
        Delimiter: '/',
    };

    if (prefix !== '') PARAMS.Prefix = prefix;

    const objectList = await s3Client.listObjectsV2(PARAMS).promise().catch(error => {
        console.error(error.message);
    });

    return objectList;
}
