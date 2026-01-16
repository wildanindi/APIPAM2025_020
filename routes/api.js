const express = require('express');
const router = express.Router();

// Import Controllers
const authController = require('../controllers/authController');
const concertController = require('../controllers/concertController');
const ticketController = require('../controllers/ticketController');
const orderController = require('../controllers/orderController');

const authMiddleware = require('../middleware/authMiddleware');

// --- AUTH ---
router.post('/login', authController.login);
router.post('/register', authController.register);

// --- CONCERTS (FANS & ADMIN) ---
router.get('/concerts', concertController.getAll);
router.get('/concerts/:id', concertController.getById);
router.post('/concerts', concertController.create);
router.put('/concerts/:id', concertController.update);
router.delete('/concerts/:id', concertController.delete);

// --- TICKETS (TRANSAKSI) ---
router.post('/tickets/buy', authMiddleware.verifyToken, ticketController.buyTicket);
router.get('/tickets/my-ticket', authMiddleware.verifyToken, ticketController.getMyTickets);
router.post('/tickets/validate', ticketController.validateTicket); // CREW

// --- ORDERS (HISTORY) ---
router.get('/orders', authMiddleware.verifyToken,orderController.getHistory);

module.exports = router;