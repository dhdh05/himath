const express = require('express');
const router = express.Router();
const streakController = require('../controllers/streakController');
const verifyToken = require('../middleware/authMiddleware');

// GET /api/streak - Lấy streak hiện tại
router.get('/', verifyToken, streakController.getStreak);

module.exports = router;

