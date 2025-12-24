import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  getGameLevels,
  getGameLevelById,
  saveGameResult,
  getStudentGameProgress,
  getAllGameProgress,
  getStudentGameResults,
  getStudentAchievements,
  getGameLeaderboard,
  getGameStatistics,
  createOrUpdateGameLevel,
  deleteGameLevel
} from '../controllers/gameController.js';

const router = express.Router();

/**
 * PUBLIC ROUTES - Không cần bảo vệ
 */

// Lấy tất cả level của một trò chơi
router.get('/levels/:gameType', getGameLevels);

// Lấy chi tiết một level
router.get('/level/:levelId', getGameLevelById);

// Bảng xếp hạng game
router.get('/leaderboard/:gameType', getGameLeaderboard);

/**
 * PROTECTED ROUTES - Cần xác thực
 */

// Lưu kết quả chơi game
router.post('/result', protect, saveGameResult);

// Lấy tiến độ game của học sinh
router.get('/progress/:studentId/:gameType', protect, getStudentGameProgress);

// Lấy tiến độ tất cả game của học sinh
router.get('/progress/:studentId', protect, getAllGameProgress);

// Lấy kết quả chơi game của học sinh
router.get('/results/:studentId', protect, getStudentGameResults);

// Lấy thành tích của học sinh
router.get('/achievements/:studentId', protect, getStudentAchievements);

// Lấy thống kê game của học sinh
router.get('/stats/:studentId', protect, getGameStatistics);

/**
 * ADMIN ONLY ROUTES
 */

// Tạo game level mới
router.post('/level', protect, restrictTo('admin'), createOrUpdateGameLevel);

// Cập nhật game level
router.put('/level/:levelId', protect, restrictTo('admin'), createOrUpdateGameLevel);

// Xóa game level
router.delete('/level/:levelId', protect, restrictTo('admin'), deleteGameLevel);

export default router;
