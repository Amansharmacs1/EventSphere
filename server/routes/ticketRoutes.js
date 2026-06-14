const express = require('express');
const {
  getMyTickets,
  getTicketsForEvent,
  verifyTicket,
  downloadTicketPDF
} = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/my', protect, authorize('student'), getMyTickets);
router.get('/event/:eventId', protect, authorize('admin'), getTicketsForEvent);
router.post('/scan', protect, authorize('admin'), verifyTicket);
router.get('/:id/download', protect, downloadTicketPDF);

module.exports = router;
