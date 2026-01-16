const db = require('../config/db');

exports.findByUsername = (username, callback) => {
    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], callback);
};

exports.create = (data, callback) => {
    // Ingat: Tanpa Email sesuai request sebelumnya
    const sql = "INSERT INTO users (full_name, username, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [data.full_name, data.username, data.password, data.role], callback);
};