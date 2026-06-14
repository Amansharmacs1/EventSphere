const express = require('express');
const {
  getRecommendations,
  getCertificates,
  downloadCertificatePDF
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/recommendations', protect, authorize('student'), getRecommendations);
router.get('/certificates', protect, authorize('student'), getCertificates);
router.get('/certificates/:id/download', protect, authorize('student'), downloadCertificatePDF);

module.exports = router;
