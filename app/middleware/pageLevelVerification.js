const {VERIFICATION_LEVEL} = require('../consts/useRoleVerificationLevelEnum');

/**
 * ページごとの必要レベル判定
 * @param {Number} verificationLevel
 * @return {function(...[*]=)}
 */
exports.verifyLevel = (verificationLevel) => {
    return (req, res, next) => {
        const user = req.session.user;
        const myLevel = VERIFICATION_LEVEL.getMyLevel(user.role);

        if (myLevel < verificationLevel) {
            res.redirect("/forbidden");
        } else {
            return next();
        }
    };
};