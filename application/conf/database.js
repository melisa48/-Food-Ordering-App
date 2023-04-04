const mysql = require('mysql2');

const db = mysql.createPool({
    host: '34.217.102.90',
    user: 'team7',
    database: 'team7',
    password: 'Backside180!'
});

module.exports = db;