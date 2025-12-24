import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getStudentProfile,
  updateStudentProfile
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all users
router.get('/', protect, getUsers);

// Get user by ID
router.get('/:id', protect, getUserById);

// Update user
router.put('/:id', protect, updateUser);

// Delete user (admin only)
router.delete('/:id', protect, authorize('admin'), deleteUser);

// Student profile routes
router.get('/student/:id', protect, getStudentProfile);
router.put('/student/:id', protect, updateStudentProfile);

export default router;
