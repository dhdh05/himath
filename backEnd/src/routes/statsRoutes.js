const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const verifyToken = require('../middleware/authMiddleware');

// Chỉ ghi log khi đã đăng nhập
router.post('/visit', verifyToken, statsController.logVisit);
router.post('/event', verifyToken, statsController.logEvent);

module.exports = router;