/**
 * ログイン後ホーム画面
 * @param req
 * @param res
 */
exports.home = (req, res) => {
    const user = req.session.user;
    res.render('home.ejs', {
        error: req.flash("error"),
        success: req.flash("success"),
        params: {title: 'ホーム', role: user.role}
    });
};

/**
 * ログイン画面
 * @param req
 * @param res
 */
exports.login = (req, res) => {
    res.render('login', {
        error: req.flash("error"),
        success: req.flash("success"),
        params: {title: 'ログイン'}
    });
};

/**
 * ログアウト処理
 * @param req
 * @param res
 */
exports.logout = (req, res) => {
    // セッション切断
    req.session.destroy();
    res.redirect("/login");
};
