const db = require('../config/db');

exports.createOrder = (data, callback) => {
    const sql = `INSERT INTO orders (user_id, concert_id, total_price, payment_status, trans_date) 
                 VALUES (?, ?, ?, 'PAID', NOW())`;
    db.query(sql, [data.user_id, data.concert_id, data.total_price], callback);
};

exports.getHistoryByUser = (userId, callback) => {
    const sql = `
        SELECT o.order_id, o.trans_date, o.total_price, o.payment_status, 
               c.event_name AS concertName, 
               c.poster_image 
        FROM orders o
        JOIN concerts c ON o.concert_id = c.concert_id
        WHERE o.user_id = ?
        ORDER BY o.trans_date DESC
    `;
    db.query(sql, [userId], callback);
};