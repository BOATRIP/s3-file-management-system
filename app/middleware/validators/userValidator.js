const bodyValidator = require('express-validator').body;
const USER_ROLE = require('../../consts/UserRoleEnum').USER_ROLE;

/**
 * ユーザー登録用ヴァリデーター
 * @type {ValidationChain[]}
 */
exports.registerUser = [
    bodyValidator('loginId').not().isEmpty().isAlphanumeric(),
    bodyValidator('name').not().isEmpty().isString(),
    bodyValidator('password').not().isEmpty().isAlphanumeric(),
    bodyValidator('role').not().isEmpty().isIn(Object.values(USER_ROLE)),
];

/**
 * ユーザー削除用ヴァリデーター
 * @type {ValidationChain[]}
 */
exports.deleteUser = [
    bodyValidator('loginId').not().isEmpty().isString(),
];

exports.updateMyProfile = [
    bodyValidator('name').not().isEmpty().isString(),
];