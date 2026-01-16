const Ticket = require('../models/ticketModel');
const Order = require('../models/orderModel');
const Concert = require('../models/concertModel');
const db = require('../config/db'); // ⚠️ Pastikan ini ada agar db.query bisa jalan

// --- 1. FUNGSI BELI TIKET ---
exports.buyTicket = (req, res) => {
    // ⚠️ PERBAIKAN PENTING:
    // Jangan Hardcode ID! Ambil dari Token.
    const user_id = req.user.id; 
    
    const { concert_id, category, quantity } = req.body;

    // Validasi input
    if (!concert_id || !category || !quantity) {
        return res.status(400).json({ status: 'error', message: 'Data tidak lengkap' });
    }

    console.log(`User ID ${user_id} sedang membeli ${quantity} tiket...`);

    // 1. Ambil Harga Konser
    Concert.getById(concert_id, (err, results) => {
        if (err || results.length === 0) return res.json({ status: 'error', message: 'Konser tidak ditemukan' });

        const concert = results[0];
        // Tentukan harga berdasarkan kategori
        const singlePrice = category === 'VIP' ? concert.price_vip : concert.price_reguler;
        const totalPrice = singlePrice * quantity;

        // 2. Buat Order (Transaksi)
        const orderData = { user_id, concert_id, total_price: totalPrice };
        
        Order.createOrder(orderData, (err, resultOrder) => {
            if (err) return res.json({ status: 'error', message: 'Gagal membuat order: ' + err.message });

            const newOrderId = resultOrder.insertId;
            const ticketResponse = [];

            // 3. Buat Tiket (Looping sejumlah quantity)
            let processed = 0;
            for (let i = 0; i < quantity; i++) {
                // Generate Ticket Code Unik: KATEGORI-RANDOMNUMBER
                const ticketCode = category + '-' + Math.floor(Math.random() * 90000 + 10000);
                
                const ticketData = { 
                    ticket_code: ticketCode, 
                    order_id: newOrderId, 
                    user_id: user_id, // Pakai user_id dari token
                    concert_id: concert_id, 
                    category: category 
                };
                
                Ticket.createTicket(ticketData, (err) => {
                    if (!err) {
                        ticketResponse.push({ ticket_code: ticketCode, category, status: 'VALID' });
                    }
                    processed++;
                    
                    // Cek jika looping sudah selesai semua
                    if (processed === parseInt(quantity)) {
                         res.json({
                            status: 'success',
                            message: `Berhasil membeli ${quantity} tiket. Total: Rp ${totalPrice}`,
                            data: ticketResponse
                        });
                    }
                });
            }
        });
    });
};

// --- 2. FUNGSI LIHAT TIKET SAYA ---
exports.getMyTickets = (req, res) => {
    // 1. Ambil ID User dari Token
    const userId = req.user.id; 

    console.log("Mengambil data MyTickets untuk User ID:", userId);

    // 2. Query dengan JOIN ke tabel Concerts
    // Agar Android bisa menampilkan Nama Event dan Tanggal, bukan cuma kode tiket
    const sql = `
        SELECT 
            t.ticket_code AS ticketCode,   
            t.status AS status,
            t.category AS category,
            c.event_name AS eventName,     
            c.date AS date,
            c.venue AS venue,
            c.poster_image AS posterImage  
        FROM tickets t
        JOIN concerts c ON t.concert_id = c.concert_id
        WHERE t.user_id = ?  
        ORDER BY t.order_id DESC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        res.json({ 
            status: 'success',
            message: 'Data Tiket Saya', 
            data: results 
        });
    });
};

// --- 3. FUNGSI VALIDASI TIKET (Scanner) ---
exports.validateTicket = (req, res) => {
    const { ticketCode } = req.body; 
    
    // Pastikan validasi cek variabel yang baru
    if (!ticketCode) {
        return res.status(400).json({ status: 'error', message: 'Kode tiket wajib diisi' });
    }
    
    Ticket.findByCode(ticketCode, (err, results) => {
        if (err || results.length === 0) {
            return res.json({ status: 'error', message: 'KODE TIKET TIDAK DITEMUKAN' });
        }
        
        const ticket = results[0];

        // Cek Status
        if (ticket.status === 'USED') {
            return res.json({ 
                status: 'success', // Tetap success agar UI menampilkan data, tapi pesannya warning
                message: 'TIKET SUDAH TERPAKAI (USED)', 
                data: ticket 
            });
        }

        // Update jadi USED
        Ticket.updateStatus(ticketCode, 'USED', (err) => {
            if (err) return res.json({ status: 'error', message: 'Gagal Update Status' });
            
            ticket.status = 'USED'; // Update objek lokal untuk response
            res.json({ 
                status: 'success', 
                message: 'TIKET VALID! SILAKAN MASUK.', 
                data: ticket 
            });
        });
    });
};