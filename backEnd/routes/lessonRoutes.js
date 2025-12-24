import express from 'express';
import {
  getLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson
} from '../controllers/lessonController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all lessons (public)
router.get('/', getLessons);

// Get lesson by ID (public)
router.get('/:id', getLessonById);

// Create lesson (teacher/admin only)
router.post('/', protect, authorize('teacher', 'admin'), createLesson);

// Update lesson (teacher/admin only)
router.put('/:id', protect, authorize('teacher', 'admin'), updateLesson);

// Delete lesson (teacher/admin only)
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteLesson);

export default router;
