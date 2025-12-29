const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const verifyToken = require('../middleware/authMiddleware');

// POST /api/achievements/check - Check và trao achievements (gọi sau khi submit score)
router.post('/check', verifyToken, async (req, res) => {
    try {
        const result = await achievementController.checkAchievements(req);
        res.json(result);
    } catch (error) {
        console.error("Lỗi check achievements:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// GET /api/achievements - Lấy danh sách achievements
router.get('/', verifyToken, achievementController.getAchievements);

module.exports = router;

