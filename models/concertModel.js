const db = require('../config/db');

exports.getAll = (callback) => {
    db.query("SELECT * FROM concerts", callback);
};

exports.getById = (id, callback) => {
    db.query("SELECT * FROM concerts WHERE concert_id = ?", [id], callback);
};

exports.create = (data, callback) => {
    const sql = `INSERT INTO concerts (event_name, date, venue, artist_lineup, price_vip, price_reguler, poster_image) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [data.event_name, data.date, data.venue, data.artist_lineup, data.price_vip, data.price_reguler, data.poster_image], callback);
};

exports.update = (id, data, callback) => {
    const sql = `UPDATE concerts SET 
                 event_name=?, date=?, venue=?, artist_lineup=?, price_vip=?, price_reguler=?, poster_image=?
                 WHERE concert_id=?`;
    db.query(sql, [data.event_name, data.date, data.venue, data.artist_lineup, data.price_vip, data.price_reguler, data.poster_image, id], callback);
};

exports.delete = (id, callback) => {
    // Hapus tiket dulu biar bersih (Cascade manual)
    db.query("DELETE FROM tickets WHERE concert_id = ?", [id], () => {
        db.query("DELETE FROM concerts WHERE concert_id = ?", [id], callback);
    });
};