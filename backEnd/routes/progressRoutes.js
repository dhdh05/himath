import express from 'express';
import {
  getStudentProgress,
  updateLessonProgress,
  completeLesson,
  getCompletedLevels,
  completeLevel,
  getStudentRewards,
  awardReward
} from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get student progress
router.get('/student/:student_id', protect, getStudentProgress);

// Update lesson progress
router.post('/update', protect, updateLessonProgress);

// Complete lesson
router.put('/complete/:student_id/:lesson_id', protect, completeLesson);

// Get completed levels
router.get('/levels/:user_id', protect, getCompletedLevels);

// Complete level
router.post('/levels/complete', protect, completeLevel);

// Get student rewards
router.get('/rewards/:student_id', protect, getStudentRewards);

// Award reward
router.post('/rewards/award', protect, awardReward);

export default router;
