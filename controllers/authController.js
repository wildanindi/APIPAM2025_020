const User = require('../models/userModel');
// 👇 1. IMPORT LIBRARY JWT
const jwt = require('jsonwebtoken');

// 👇 2. KUNCI RAHASIA (WAJIB SAMA DENGAN MIDDLEWARE)
const secretKey = 'RAHASIA_NEGARA'; 

exports.login = (req, res) => {
    const { username, password } = req.body;
    
    User.findByUsername(username, (err, results) => {
        if (err) return res.json({ status: 'error', message: 'Server Error' });
        
        if (results.length > 0) {
            const user = results[0];

            // Cek password sederhana (plaintext)
            if (user.password === password) {

                // 👇 3. BUAT TOKEN ASLI (JWT)
                // Payload { id: ... } ini nanti yang dibaca oleh req.user.id di middleware
                const token = jwt.sign(
                    { id: user.user_id, role: user.role }, 
                    secretKey, 
                    { expiresIn: '24h' } // Token kadaluwarsa dalam 24 jam
                );

                return res.json({
                    status: 'success',
                    message: 'Login Berhasil',
                    data: {
                        user_id: user.user_id,
                        username: user.username,
                        full_name: user.full_name,
                        role: user.role,
                        token: token // ✅ Kirim Token JWT yang Asli
                    }
                });
            }
        }
        res.json({ status: 'error', message: 'Username atau Password Salah' });
    });
};

exports.register = (req, res) => {
    const { full_name, username, password, role } = req.body;
    const userRole = role ? role : 'FAN';
    const newUser = { full_name, username, password, role: userRole };

    User.create(newUser, (err, result) => {
        if (err) {
            console.error("Error Register:", err);
            return res.json({ status: 'error', message: 'Gagal daftar: ' + err.message });
        }
        res.json({
            status: 'success',
            message: 'Registrasi Berhasil',
            data: { username: username, role: userRole }
        });
    });
};