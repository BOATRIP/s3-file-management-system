const LocalStrategy = require('passport-local').Strategy;

const User = require('../models').User;
const logger = require('../../lib/logger').getLogger("system");

/**
 * passport処理
 * @param passport
 */
module.exports = (passport) => {
    /**
     * セッションシリアライズ
     */
    passport.serializeUser((user, done) => {
        done(null, user);
    });


    /**
     * セッションデシリアライズ
     */
    passport.deserializeUser((id, done) => {
        User.findOne({
            where: {
                id: id
            }
        }).then(user => {
            return done(null, user);
        }).catch((err) => {
            return done(err.message);
        });
    });

    /**
     * ログイン
     */
    passport.use('local-login', new LocalStrategy({
            usernameField: 'loginId',
            passwordField: 'password',
            passReqToCallback: true
        },
        (req, loginId, password, done) => {
            User.findOne({
                where: {
                    login_id: loginId
                }
            }).then(user => {
                if (!user) return done(null, false, req.flash('error', '対象のログインIDがありません。登録申請をしてください。'));
                if (!user.validPassword(password)) return done(null, false, req.flash('error', 'ログインID、或いはパスワードが正しくありません。'));
                if (user.is_deleted) return done(null, false, req.flash('error', '対象のログインIDは削除されています。'));

                req.session.user = user;

                return done(null, user);

            }).catch((err) => {
                logger.error('Unable to connect to the database:', err);
                return done(null, false, req.flash('error', err.message));
            });
        }));
};

    
    





