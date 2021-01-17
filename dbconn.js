const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host     : 'localhost',
    user     : 'memethai',
    password : 'A2m9q^b1',
    database : 'comsci_memethai'
    });
    
    module.exports = pool;