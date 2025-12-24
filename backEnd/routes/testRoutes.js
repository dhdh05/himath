import express from 'express';
import {
  getTests,
  getTestById,
  createTest,
  submitTestResult,
  getTestResults,
  getStudentTestResults
} from '../controllers/testController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all tests (public)
router.get('/', getTests);

// Get test by ID (public)
router.get('/:id', getTestById);

// Create test (teacher/admin only)
router.post('/', protect, authorize('teacher', 'admin'), createTest);

// Submit test result
router.post('/results/submit', protect, submitTestResult);

// Get test results
router.get('/results', protect, getTestResults);

// Get student test results
router.get('/results/student/:student_id', protect, getStudentTestResults);

export default router;
