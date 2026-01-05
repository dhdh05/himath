const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const verifyToken = require('../middleware/authMiddleware');

// GET /api/leaderboard/score - Bang xep hang theo diem
router.get('/score', verifyToken, leaderboardController.getLeaderboardByScore);

// GET /api/leaderboard/time - Bang xep hang theo thoi gian
router.get('/time', verifyToken, leaderboardController.getLeaderboardByTime);

// GET /api/leaderboard/stars - Bang xep hang theo sao
router.get('/stars', verifyToken, leaderboardController.getLeaderboardByStars);

// GET /api/leaderboard/all - Bang xep hang tong hop (tat ca thong tin)
router.get('/all', verifyToken, leaderboardController.getLeaderboardAll);

module.exports = router;

