// コントローラー
const home = require('../app/controllers/home');
const user = require('../app/controllers/user');
const s3file = require('../app/controllers/s3file');
const multer = require('multer');
const uploadImage = multer({storage: multer.memoryStorage()}).single('imageFile');
const loggedInAuth = require('../app/middleware/loggedInAuth');
const pageAuth = require('../app/middleware/pageLevelVerification');
const {VERIFICATION_LEVEL} = require('../app/consts/useRoleVerificationLevelEnum');
const forbidden = require('../app/controllers/forbidden');

// ヴァリデーター
const userValidator = require('../app/middleware/validators/userValidator');

module.exports = (app, passport) => {
    passport.authenticate('register-administrator', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    })

    app.get('/login', home.login);
    app.get('/logout', loggedInAuth.loggedIn, pageAuth.verifyLevel(VERIFICATION_LEVEL.OPERATOR), home.logout);

    app.get('/', loggedInAuth.loggedIn, pageAuth.verifyLevel(VERIFICATION_LEVEL.OPERATOR), home.home);//home
    app.get('/home', loggedInAuth.loggedIn, pageAuth.verifyLevel(VERIFICATION_LEVEL.OPERATOR), home.home);//home

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    }));

    //Users
    app.get('/users', loggedInAuth.loggedIn, pageAuth.verifyLevel(VERIFICATION_LEVEL.ADMIN), user.viewAllUsers);
    app.get('/users/registrations', loggedInAuth.loggedIn, pageAuth.verifyLevel(VERIFICATION_LEVEL.ADMIN), user.viewRegistrationUser);
    app.post('/users/registrations', loggedInAuth.loggedIn, pageAuth.verifyLevel(VERIFICATION_LEVEL.ADMIN), userValidator.registerUser, user.registerUser);
    app.delete('/users/deletions', loggedInAuth.loggedIn, pageAuth.verifyLevel(VERIFICATION_LEVEL.ADMIN), userValidator.deleteUser, user.deleteUser);
    app.get('/users/profiles', loggedInAuth.loggedIn, pageAuth.verifyLevel(VERIFICATION_LEVEL.OPERATOR), user.viewMyProfile);
    app.post('/users/profiles', loggedInAuth.loggedIn, pageAuth.verifyLevel(VERIFICATION_LEVEL.OPERATOR), uploadImage, user.updateMyProfile);
    app.get('/users/profiles/images', loggedInAuth.loggedIn, pageAuth.verifyLevel(VERIFICATION_LEVEL.OPERATOR), user.fetchMyProfileImage);
    app.get('/users/informations', loggedInAuth.loggedIn, pageAuth.verifyLevel(VERIFICATION_LEVEL.OPERATOR), user.fetchMyInformation);

    // forbidden
    app.get('/forbidden', loggedInAuth.loggedIn, pageAuth.verifyLevel(VERIFICATION_LEVEL.OPERATOR), forbidden.forbidden);

    // s3file
    app.get('/s3files', loggedInAuth.loggedIn, pageAuth.verifyLevel(VERIFICATION_LEVEL.OPERATOR), s3file.viewFileList);
    app.get(['/s3files/lists', '/s3files/lists/:path'], loggedInAuth.loggedIn, pageAuth.verifyLevel(VERIFICATION_LEVEL.OPERATOR), s3file.fetchFileList);
};
