const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/adminMiddleware');

// Base Route: /api/admin
// All routes require Login AND Admin role
router.use(verifyToken);
router.use(verifyAdmin);

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
// Block/Unblock user
router.put('/users/:id/block', verifyToken, verifyAdmin, adminController.toggleBlockUser);

// Get Login History
router.get('/login-history', verifyToken, verifyAdmin, adminController.getLoginLogs);

// Get User Detail
router.get('/users/:id', verifyToken, verifyAdmin, adminController.getUserDetails);

// Send Monthly Report
router.post('/users/:id/send-report', verifyToken, verifyAdmin, adminController.sendMonthlyReport);

module.exports = router;
