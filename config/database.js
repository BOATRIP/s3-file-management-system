module.exports = {
    development: {
        "connectionLimit" : 10,
        "host" : "localhost",
        "port" : "3306",
        "database" : "s3",
        "user" : "root",
        "password" : "demodemo",
        "multipleStatements": true,
        "timezone": "Asia/Tokyo"
    },
    production: {
        "connectionLimit" : 10,
        "host" : process.env.RDS_HOSTNAME,
        "port" : process.env.RDS_PORT,
        "database" : process.env.RDS_DB_NAME,
        "user" : process.env.RDS_USERNAME,
        "password" : process.env.RDS_PASSWORD,
        "multipleStatements": true,
        "timezone": "Asia/Tokyo"
    }
};
