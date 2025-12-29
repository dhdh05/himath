const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const verifyToken = require('../middleware/authMiddleware');

// GET /api/leaderboard/score - Bảng xếp hạng theo điểm
router.get('/score', verifyToken, leaderboardController.getLeaderboardByScore);

// GET /api/leaderboard/time - Bảng xếp hạng theo thời gian
router.get('/time', verifyToken, leaderboardController.getLeaderboardByTime);

// GET /api/leaderboard/stars - Bảng xếp hạng theo sao
router.get('/stars', verifyToken, leaderboardController.getLeaderboardByStars);

// GET /api/leaderboard/all - Bảng xếp hạng tổng hợp (tất cả thông tin)
router.get('/all', verifyToken, leaderboardController.getLeaderboardAll);

module.exports = router;

