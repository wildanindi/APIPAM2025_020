const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3308,
    password: 'Semogaditerima123',
    database: 'easyconcert_db'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Gagal Konek Database:', err.message);
    } else {
        console.log('✅ Terhubung ke Database MySQL!');
    }
});

module.exports = db;