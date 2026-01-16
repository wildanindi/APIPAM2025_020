const Concert = require('../models/concertModel');

exports.getAll = (req, res) => {
    Concert.getAll((err, results) => {
        if (err) return res.json({ status: 'error', message: 'Gagal ambil data' });
        res.json({ status: 'success', message: 'List Konser', data: results });
    });
};

exports.getById = (req, res) => {
    Concert.getById(req.params.id, (err, results) => {
        if (err || results.length === 0) return res.json({ status: 'error', message: 'Konser tidak ditemukan' });
        res.json({ status: 'success', message: 'Detail Konser', data: results[0] });
    });
};

exports.create = (req, res) => {
    Concert.create(req.body, (err, result) => {
        if (err) return res.json({ status: 'error', message: err.message });
        res.json({ 
            status: 'success', message: 'Konser berhasil ditambahkan!', 
            data: { concert_id: result.insertId, event_name: req.body.event_name } 
        });
    });
};

exports.update = (req, res) => {
    Concert.update(req.params.id, req.body, (err, result) => {
        if (err) return res.json({ status: 'error', message: err.message });
        res.json({ status: 'success', message: 'Konser berhasil diperbarui!' });
    });
};

exports.delete = (req, res) => {
    Concert.delete(req.params.id, (err, result) => {
        if (err) return res.json({ status: 'error', message: err.message });
        res.json({ status: 'success', message: 'Konser berhasil dihapus!' });
    });
};