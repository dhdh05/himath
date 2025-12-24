import express from 'express';
import {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise
} from '../controllers/exerciseController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all exercises (public)
router.get('/', getExercises);

// Get exercise by ID (public)
router.get('/:id', getExerciseById);

// Create exercise (teacher/admin only)
router.post('/', protect, authorize('teacher', 'admin'), createExercise);

// Update exercise (teacher/admin only)
router.put('/:id', protect, authorize('teacher', 'admin'), updateExercise);

// Delete exercise (teacher/admin only)
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteExercise);

export default router;
