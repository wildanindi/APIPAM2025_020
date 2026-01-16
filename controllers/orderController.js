const Order = require('../models/orderModel');

exports.getHistory = (req, res) => {
    const user_id = req.user.id; // Ambil dari token
    Order.getHistoryByUser(user_id, (err, results) => {
        if (err) return res.json({ status: 'error', message: err.message });
        res.json({ status: 'success', message: 'Riwayat Pesanan', data: results });
    });
};