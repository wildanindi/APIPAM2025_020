const jwt = require('jsonwebtoken');
const secretKey = 'RAHASIA_NEGARA'; // Pastikan SAMA PERSIS dengan authController

exports.verifyToken = (req, res, next) => {
    // 1. Ambil Header Authorization
    const authHeader = req.headers['authorization'];

    // Cek apakah ada header
    if (!authHeader) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }

    // 2. BERSIHKAN TOKEN (Hapus kata "Bearer " jika ada)
    let token = authHeader;
    if (authHeader.startsWith('Bearer ')) {
        // Memotong 7 karakter pertama ('Bearer ')
        token = authHeader.slice(7, authHeader.length); 
    }

    console.log("Token Bersih:", token); // Debugging: Pastikan kata Bearer sudah hilang

    // 3. Verifikasi Token yang sudah bersih
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error("JWT Error:", err.message);
            return res.status(500).send({ auth: false, message: 'Gagal verifikasi token.' });
        }
        
        // Simpan data user (ID & Role) ke request
        req.user = decoded;
        console.log("User Sukses Login ID:", req.user.id);
        next();
    });
};