const express = require('express');
const {
  applyForEvent,
  getRegistrationsForEvent,
  getMyRegistrations,
  updateRegistrationStatus
} = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:eventId', protect, authorize('student'), applyForEvent);
router.get('/my', protect, authorize('student'), getMyRegistrations);
router.get('/event/:eventId', protect, authorize('admin'), getRegistrationsForEvent);
router.put('/:id/status', protect, authorize('admin'), updateRegistrationStatus);

module.exports = router;
