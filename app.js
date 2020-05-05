const express = require('express');

const app = express();
const helmet = require('helmet')
const sequlize_pool = require('./lib/sequlize_pool');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// 環境別Config読み込み
app.loadConfig = (key, val) => {
    const env = app.get('env');
    val = require(val);
    if (val[env]) {
        val = val[env];
    }
    app.set(key, val);
};

/***************Sequlize configuratrion********************/
app.loadConfig('database', './config/database.js');
app.set('sequlize_pool', sequlize_pool.init(app));

require('./app/models'); // load all models
require('./app/middleware/passport')(passport); // pass passport for configuration

//set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
//app.use(bodyParser()); // get information from html forms

//view engine setup
app.use('/assets',express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

// セッション管理
const env = app.get('env');
const databaseEnv = require('./config/database.js')[env];
const MySQLStore = require('express-mysql-session')(session);
const options = {
    host: databaseEnv.host,
    port: databaseEnv.port,
    user: databaseEnv.user,
    password: databaseEnv.password,
    database: databaseEnv.database,
};

/**
 * セッションストアの指定
 */
const sessionMiddleware = session({
    secret: 'S3_Annotation',
    resave: true,
    store: new MySQLStore(options),
    saveUninitialized: false
});
app.use(sessionMiddleware);

app.session = sessionMiddleware;

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routing
require('./config/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

//catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).render('404', {title: "Sorry, page not found", session: req.sessionbo});
});

app.use(function (req, res, next) {
    res.status(500).render('404', {title: "Sorry, page not found"});
});

// 管理者登録
(async () => {
    const {USER_ROLE} = require('./app/consts/UserRoleEnum');
    const User = require('./app/models').User;
    User.findOne({
        where: {
            role: USER_ROLE.ADMIN,
        }
    }).then(user => {
        if (user) {
            console.log('管理者作成済み。');
            return;
        }

        const userParam = {
            login_id: 'admin_user',
            password: '@dm1n1$tr@t0r',
            name: '管理者',
            role: USER_ROLE.ADMIN,
        };
        User.create(userParam).then(newUser => {
            console.log('管理者を作成しました。');
        })
    }).catch((err) => {
        console.error('管理者作成エラー', err.message);
    })
})();

exports = module.exports = app;