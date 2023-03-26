const mysql = require('mysql2');

const db = mysql.createPool({
    host: '52.33.83.41',
    user: 'team7',
    database: 'team7',
    password: 'Backside180!'
});

module.exports = db;