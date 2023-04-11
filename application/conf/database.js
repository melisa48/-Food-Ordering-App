const mysql = require('mysql2');

const db = mysql.createPool({
    host: '34.219.117.242',
    user: 'team7',
    database: 'team7',
    password: 'Backside180!'
});

module.exports = db;