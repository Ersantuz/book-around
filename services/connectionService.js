const mariadb = require('mariadb'); 

const pool = mariadb.createPool({
    host: "localhost",
    user: "root",
    password: "Stocastico95",
    database: "externalytics",
    port: "3307"
});

// add connection to other db
module.exports = pool;
