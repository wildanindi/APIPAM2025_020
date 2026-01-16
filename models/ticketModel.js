const db = require('../config/db');

exports.createTicket = (data, callback) => {
    const sql = `INSERT INTO tickets (ticket_code, order_id, user_id, concert_id, category, status) 
                 VALUES (?, ?, ?, ?, ?, 'VALID')`;
    db.query(sql, [data.ticket_code, data.order_id, data.user_id, data.concert_id, data.category], callback);
};

exports.getByUser = (userId, callback) => {
    const sql = `
        SELECT t.ticket_code, c.event_name, c.date, c.venue, u.full_name as owner_name, t.category, t.status
        FROM tickets t
        JOIN concerts c ON t.concert_id = c.concert_id
        JOIN users u ON t.user_id = u.user_id
        WHERE t.user_id = ?
    `;
    db.query(sql, [userId], callback);
};

exports.findByCode = (code, callback) => {
    db.query("SELECT * FROM tickets WHERE ticket_code = ?", [code], callback);
};

exports.updateStatus = (code, status, callback) => {
    db.query("UPDATE tickets SET status = ? WHERE ticket_code = ?", [status, code], callback);
};