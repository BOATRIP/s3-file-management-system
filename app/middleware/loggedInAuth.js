/**
 * ログイン検証
 * @param req
 * @param res
 * @param next
 */
exports.loggedIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};