const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import Route
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Gunakan Routes
// Semua route otomatis prefix-nya jadi root (/)
// Kalau mau tambah prefix API bisa pakai: app.use('/api', apiRoutes);
app.use('/', apiRoutes);

// Jalankan Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server MVC EasyConcert jalan di port ${PORT}`);
    console.log('🔗 URL untuk Emulator: http://10.0.2.2:3000/');
});