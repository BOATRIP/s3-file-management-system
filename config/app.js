module.exports = {
    // environment
    env: process.env.NODE_ENV || 'dev',
    // port on which to listen
    port: (process.env.NODE_ENV || 'dev') === 'dev' ? 4000 : process.env.PORT || 4001,
};