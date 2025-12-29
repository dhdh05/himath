const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// API: POST /api/auth/login
router.post('/login', authController.login);
router.post('/register', authController.register);

// API Reset PIN & Password
router.post('/reset-pin', authController.resetPin);
router.post('/forgot-password', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

// API Update User Info
router.post('/update-info', authController.updateUserInfo);

// API Reset PIN (via Email OTP)
router.post('/forgot-pin', authController.requestPinResetOTP);
router.post('/reset-pin-otp', authController.resetPinWithOTP);

module.exports = router;