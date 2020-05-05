const User = require('../models/').User;
const UserImage = require('../models/').UserImage;
const fs = require('fs');
const DEFAULT_IMAGE = fs.readFileSync('./public/img/avatars/default.png');
const {USER_ROLE} = require('../consts/UserRoleEnum');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const {PAGINATION_CONSTS} = require('../consts/paginationConsts');
const {PaginationUtil} = require('../util/paginationUtil');
const {validationResult} = require('express-validator');

/**
 * ログインしているかどうか
 * @param req
 * @param res
 * @param next
 */
exports.loggedIn = (req, res, next) => {
    if (req.session.user) { // req.session.passport._id
        next();
    } else {
        res.redirect('/login');
    }
};

/**
 * ユーザー一覧画面描画
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.viewAllUsers = async (req, res) => {
    const user = req.session.user;
    const currentPage = PaginationUtil.parseCurrentPage(req.query.page);

    // 標準の検索条件
    let defaultOption;
    if (user.role === USER_ROLE.ADMIN) {
        defaultOption = {
            where: {
                role: {[Op.notIn]: [USER_ROLE.ADMIN]}
            }
        }
    } else {
        defaultOption = {
            where: {
                role: {[Op.notIn]: [USER_ROLE.ADMIN, USER_ROLE.SUPERVISOR]},
                office_id: user.office_id,
            }
        };
    }

    // 総ページ数取得
    const userCounts = await User.find({
        attributes: [[sequelize.fn('count', sequelize.col('id')), 'counts']],
        where: defaultOption.where,
    });
    const maxPage = PaginationUtil.calcMaxPage(userCounts.dataValues.counts);

    // 現在ページの最適化
    const optimisationCurrentPage = PaginationUtil.optimizeCurrentPage(maxPage, currentPage);

    // ページング用検索条件
    const offset = PaginationUtil.calcOffset(optimisationCurrentPage);
    const extendsOption = {
        ...defaultOption,
        order: [['id', 'ASC']],
        limit: PAGINATION_CONSTS.LIMIT,
        offset: offset,
    };

    // 対象ユーザー取得
    const users = await User.findAll(extendsOption);

    res.render('user_list.ejs', {
        error: req.flash("error"),
        success: req.flash("success"),
        params: {
            title: 'ユーザー一覧',
            users: users,
            role: user.role,
            page: {
                currentPage: optimisationCurrentPage,
                maxPage: maxPage,
            }
        }
    });
};

/**
 * ユーザー作成画面描画
 * @param req
 * @param res
 */
exports.viewRegistrationUser = async (req, res) => {
    const user = req.session.user;

    res.render('user_registration.ejs', {
        error: req.flash("error"),
        success: req.flash("success"),
        params: {
            title: 'ユーザー登録',
            role: user.role,
        }
    });
};

/**
 * ユーザー作成
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.registerUser = async (req, res) => {
    try {
        // ヴァリデーションチェック
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new Error();
        }

        const body = req.body;

        const userParam = {
            login_id: body.loginId,
            password: body.password,
            name: body.name,
            role: body.role,
        };

        User.create(userParam).then(newUser => {
            req.flash('success', '新規アカウントを作成しました。');
            res.redirect('/users/registrations');
        })
    } catch (error) {
        req.flash('error', 'ユーザー登録に失敗しました。');
        res.redirect('/users/registrations');
        console.error(error.stack);
    }
};

/**
 * ユーザー削除
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.deleteUser = async (req, res) => {
    const body = req.body;

    try {
        // ヴァリデーションチェック
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new Error();
        }

        const maybeUser = await User.findOne({where: {login_id: body.loginId}});
        if(maybeUser === null) throw new Error(`loginId=${body.loginId}は存在しません。`);

        await User.update({is_deleted: true}, {where: {login_id: body.loginId}});

        res.json({
            code: 200
        });
    } catch (error) {
        console.error(error.message);
        res.json({
            code: 500,
            message: error.message
        });
    }
};

/**
 * プロフィール更新画面描画
 * @param req
 * @param res
 */
exports.viewMyProfile = (req, res) => {
    const user = req.session.user;

    res.render('user_profile.ejs', {
        error: req.flash("error"),
        success: req.flash("success"),
        params: {
            title: 'プロフィール更新',
            role: user.role,
            name: user.name,
        }
    });
};

/**
 * プロフィール更新
 * @param req
 * @param res
 */
exports.updateMyProfile = async (req, res) => {
    const user = req.session.user;
    const file = req.file;
    const name = req.body.name;

    try {
        // ヴァリデーションチェック
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new Error();
        }

        if (!!file) {
            await UserImage.upsert({
                user_id: user.id,
                image: file.buffer
            });
        }

        await User.update({
            name: name,
        }, {
            where: {id: user.id,}
        });

        req.session.user.name = name;

        req.flash('success', '更新に成功しました。');
    } catch (error) {
        console.error(`userId=${user.id}のファイルアップロードエラー。`, error.stack);
        req.flash('error', '更新に失敗しました。');
    }
    res.redirect('/users/profiles');
};

/**
 * プロフィール画像取得
 * @param req
 * @param res
 */
exports.fetchMyProfileImage = async (req, res) => {
    const user = req.session.user;

    res.set('Content-Type', 'image/*');
    try {
        const userImage = await UserImage.findOne({where: {user_id: user.id}});
        if (userImage === null || userImage.image === null) {
            res.send(DEFAULT_IMAGE);
        } else {
            res.send(userImage.image);
        }
    } catch (error) {
        console.error(`userId=${user.id}のファイル取得エラー。`, error.stack);
        res.send(DEFAULT_IMAGE);
    }
};


/**
 * ユーザー情報取得
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.fetchMyInformation = async (req, res) => {
    try {
        const user = req.session.user;
        res.json({
            code: 200,
            user: {
                name: user.name,
                role: user.role
            },
        });
    } catch (e) {
        res.json({
            code: 500,
            message: '対象のログインIDは存在しません。'
        });
    }
};