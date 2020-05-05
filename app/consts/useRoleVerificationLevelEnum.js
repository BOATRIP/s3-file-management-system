const {USER_ROLE} = require('./UserRoleEnum');

const _verificationLevel = {
    ADMIN: 20,
    OPERATOR: 0,
};

/**
 * 自身のロールに紐づくレベル取得
 * @param {String} myRole
 */
_verificationLevel.getMyLevel = (myRole) => {
    const role = myRole.toLocaleUpperCase() || USER_ROLE.OPERATOR;
    return _verificationLevel[role];
};

/**
 * 認可レベル
 * @type {{OPERATOR: number, ADMIN: number}}
 */
exports.VERIFICATION_LEVEL = _verificationLevel;
