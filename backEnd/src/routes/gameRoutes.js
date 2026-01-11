const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const verifyToken = require('../middleware/authMiddleware');

// GET: /api/games/levels/hoc-so
router.get('/levels/:gameType', gameController.getLevels);

// GET: /api/games/questions/practice-keo-co
router.get('/questions/:gameType', gameController.getQuestions);

// POST: /api/games/submit
router.post('/submit', verifyToken, gameController.submitScore);

module.exports = router;