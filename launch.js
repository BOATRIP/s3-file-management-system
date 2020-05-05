#!/usr/bin/env node

/**
 * Module dependencies.
 */
const config = require('./config/app');
const app = require('./app');
const http = require('http');

/**
 * Promiseを無視した場合のログ出力
 */
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

/**
 * Get port from environment and store in Express.
 */
app.set('port', config.port);

/**
 * HTTP サーバを作成する
 */
const server = http.createServer(app);
console.info(`Web server has started. http://127.0.0.1:${config.port}/`);

// 指定したポートで待受
server.listen(config.port);
