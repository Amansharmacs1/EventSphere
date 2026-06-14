const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  generateAIDescription
} = require('../controllers/eventController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protect, authorize('admin'), createEvent);

router.post('/ai-description', protect, authorize('admin'), generateAIDescription);

router.route('/:id')
  .get(getEvent)
  .put(protect, authorize('admin'), updateEvent)
  .delete(protect, authorize('admin'), deleteEvent);

module.exports = router;
