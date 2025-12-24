import express from 'express';
import { register, login, quickLogin, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/quick-login', quickLogin);

// Protected routes
router.get('/me', protect, getMe);

export default router;
