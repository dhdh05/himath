const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');
const verifyToken = require('../middleware/authMiddleware');

// POST /api/rewards/check - Check và trao rewards
router.post('/check', verifyToken, async (req, res) => {
    try {
        const result = await rewardController.checkRewards(req);
        res.json(result);
    } catch (error) {
        console.error("Lỗi check rewards:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// GET /api/rewards - Lấy danh sách rewards
router.get('/', verifyToken, rewardController.getRewards);

module.exports = router;

