const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');

// --- ĐOẠN SỬA "BAO SÂN" (CHỐNG LỖI) ---
const middleware = require('../middleware/authMiddleware');

// Kiểm tra: Nếu nó là Object chứa hàm verifyToken thì lấy ra, còn nếu là hàm rồi thì dùng luôn
const verifyToken = middleware.verifyToken ? middleware.verifyToken : middleware;

console.log("🔥 Đã fix xong. Check verifyToken type:", typeof verifyToken);
// Nó PHẢI hiện là 'function' thì mới chạy được
// ---------------------------------------

router.post('/verify-pin', verifyToken, parentController.verifyPin);
router.get('/stats/:student_id', verifyToken, parentController.getStats);
router.get('/today-time', verifyToken, parentController.getTodayTotalTime);

module.exports = router;