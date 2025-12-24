import { GameLevel, GameResult, StudentGameProgress, GameAchievement, Student } from '../models/index.js';
import { Op } from 'sequelize';

// Lấy tất cả các level của một trò chơi
export const getGameLevels = async (req, res) => {
  try {
    const { gameType } = req.params;

    const levels = await GameLevel.findAll({
      where: { game_type: gameType },
      order: [['level_number', 'ASC']]
    });

    if (!levels || levels.length === 0) {
      return res.status(404).json({
        message: `Không tìm thấy level cho trò chơi: ${gameType}`
      });
    }

    res.status(200).json({
      success: true,
      data: levels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy chi tiết một level
export const getGameLevelById = async (req, res) => {
  try {
    const { levelId } = req.params;

    const level = await GameLevel.findByPk(levelId);

    if (!level) {
      return res.status(404).json({
        message: 'Không tìm thấy level này'
      });
    }

    res.status(200).json({
      success: true,
      data: level
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Tính số sao dựa trên điểm số, thời gian và số lần thử
const calculateStars = (score, timeSpent, timeLimit, attempts = 1) => {
  let stars = 0;

  // Điểm cơ bản (0-2 sao)
  if (score >= 100) stars = 3;
  else if (score >= 80) stars = 2;
  else if (score >= 60) stars = 1;
  else stars = 0;

  // Bonus thời gian nhanh (thêm 1 sao nếu hoàn thành < 50% thời gian)
  if (timeSpent && timeLimit && timeSpent < timeLimit * 0.5 && stars > 0) {
    stars = Math.min(3, stars + 1);
  }

  // Penalty cho nhiều lần thử
  if (attempts > 2) {
    stars = Math.max(0, stars - 1);
  }

  return Math.min(3, Math.max(0, stars));
};

// Lưu kết quả chơi game
export const saveGameResult = async (req, res) => {
  try {
    const { studentId, levelId, score, timeSpent, answers } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!studentId || !levelId || score === undefined) {
      return res.status(400).json({
        message: 'Thiếu dữ liệu bắt buộc: studentId, levelId, score'
      });
    }

    // Lấy thông tin level để kiểm tra yêu cầu
    const level = await GameLevel.findByPk(levelId);
    if (!level) {
      return res.status(404).json({
        message: 'Không tìm thấy level này'
      });
    }

    // Kiểm tra học sinh tồn tại (Student uses user_id as primary key)
    const student = await Student.findOne({ where: { user_id: studentId } });
    if (!student) {
      return res.status(404).json({
        message: 'Không tìm thấy học sinh này'
      });
    }

    // Tính số sao
    const stars = calculateStars(score, timeSpent, level.time_limit);
    const isPassed = score >= (level.required_score || 60);

    // Lưu kết quả
    const result = await GameResult.create({
      student_id: studentId,
      level_id: levelId,
      game_type: level.game_type,
      score: Math.round(score),
      max_score: 100,
      stars: stars,
      time_spent: timeSpent || 0,
      is_passed: isPassed,
      answers: answers || {}
    });

    // Cập nhật tiến độ học sinh trong trò chơi
    await updateStudentGameProgress(studentId, level.game_type, level.level_number, isPassed, stars);

    // Kiểm tra và mở khóa thành tích
    const achievements = await checkAndUnlockAchievements(studentId, level.game_type, score, stars);

    res.status(201).json({
      success: true,
      message: 'Lưu kết quả thành công',
      result_id: result.result_id,
      student_id: studentId,
      level_id: levelId,
      game_type: level.game_type,
      score: Math.round(score),
      stars: stars,
      is_passed: isPassed,
      achievements: achievements,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Cập nhật tiến độ học sinh trong trò chơi
const updateStudentGameProgress = async (studentId, gameType, levelNumber, isPassed, stars) => {
  try {
    let progress = await StudentGameProgress.findOne({
      where: {
        student_id: studentId,
        game_type: gameType
      }
    });

    if (!progress) {
      progress = await StudentGameProgress.create({
        student_id: studentId,
        game_type: gameType,
        current_level: levelNumber,
        highest_level_passed: isPassed ? levelNumber : 0,
        total_stars: stars,
        total_attempts: 1
      });
    } else {
      // Cập nhật level cao nhất nếu đã vượt qua
      if (isPassed && levelNumber > progress.highest_level_passed) {
        progress.highest_level_passed = levelNumber;
      }

      // Cập nhật level hiện tại
      progress.current_level = Math.max(progress.current_level, levelNumber);

      // Cộng số sao
      progress.total_stars += stars;

      // Tăng số lần thử
      progress.total_attempts += 1;

      // Cập nhật thời gian chơi lần cuối
      progress.last_played_at = new Date();

      await progress.save();
    }

    return progress;
  } catch (error) {
    console.error('Lỗi cập nhật tiến độ:', error);
  }
};

// Kiểm tra và mở khóa thành tích
const checkAndUnlockAchievements = async (studentId, gameType, score, stars) => {
  try {
    const achievements = [];

    // Thành tích: Chơi lần đầu
    const firstPlayCount = await GameResult.count({
      where: {
        student_id: studentId,
        game_type: gameType
      }
    });

    if (firstPlayCount === 1) {
      const existing = await GameAchievement.findOne({
        where: {
          student_id: studentId,
          achievement_type: 'first_play',
          game_type: gameType
        }
      });

      if (!existing) {
        achievements.push({
          student_id: studentId,
          game_type: gameType,
          achievement_type: 'first_play',
          title: 'Khởi đầu',
          description: `Chơi lần đầu tiên ${gameType}`,
          icon_url: '/assets/badges/first_play.png'
        });
      }
    }

    // Thành tích: Điểm hoàn hảo (100 điểm)
    if (score === 100) {
      const existing = await GameAchievement.findOne({
        where: {
          student_id: studentId,
          achievement_type: 'perfect_score',
          game_type: gameType
        }
      });

      if (!existing) {
        achievements.push({
          student_id: studentId,
          game_type: gameType,
          achievement_type: 'perfect_score',
          title: 'Hoàn hảo',
          description: 'Đạt 100 điểm',
          icon_url: '/assets/badges/perfect_score.png'
        });
      }
    }

    // Thành tích: Thu thập 3 sao (level_master)
    const totalStars = await GameResult.sum('stars', {
      where: {
        student_id: studentId,
        game_type: gameType,
        stars: 3
      }
    });

    if (totalStars >= 3) {
      const existing = await GameAchievement.findOne({
        where: {
          student_id: studentId,
          achievement_type: 'level_master',
          game_type: gameType
        }
      });

      if (!existing) {
        achievements.push({
          student_id: studentId,
          game_type: gameType,
          achievement_type: 'level_master',
          title: 'Bậc thầy',
          description: 'Đạt 3 sao ở 3 level',
          icon_url: '/assets/badges/level_master.png'
        });
      }
    }

    // Thành tích: Streak 5 lần vượt qua liên tiếp
    const recentResults = await GameResult.findAll({
      where: {
        student_id: studentId,
        game_type: gameType,
        is_passed: true
      },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    if (recentResults.length >= 5) {
      const existing = await GameAchievement.findOne({
        where: {
          student_id: studentId,
          achievement_type: 'streak_5',
          game_type: gameType
        }
      });

      if (!existing) {
        achievements.push({
          student_id: studentId,
          game_type: gameType,
          achievement_type: 'streak_5',
          title: 'Chuỗi 5',
          description: 'Vượt qua 5 level liên tiếp',
          icon_url: '/assets/badges/streak_5.png'
        });
      }
    }

    // Thành tích: Speedrun (hoàn thành < 50% thời gian)
    if (stars === 3 && score >= 80) {
      const existing = await GameAchievement.findOne({
        where: {
          student_id: studentId,
          achievement_type: 'speedrun',
          game_type: gameType
        }
      });

      if (!existing) {
        achievements.push({
          student_id: studentId,
          game_type: gameType,
          achievement_type: 'speedrun',
          title: 'Người nhanh tay',
          description: 'Hoàn thành trong thời gian kỷ lục',
          icon_url: '/assets/badges/speedrun.png'
        });
      }
    }

    // Lưu tất cả thành tích mới
    if (achievements.length > 0) {
      await GameAchievement.bulkCreate(achievements);
    }

    return achievements;
  } catch (error) {
    console.error('Lỗi kiểm tra thành tích:', error);
  }
};

// Lấy tiến độ game của học sinh
export const getStudentGameProgress = async (req, res) => {
  try {
    const { studentId, gameType } = req.params;

    const progress = await StudentGameProgress.findOne({
      where: {
        student_id: studentId,
        game_type: gameType
      }
    });

    if (!progress) {
      return res.status(404).json({
        message: 'Không tìm thấy tiến độ cho trò chơi này'
      });
    }

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy tiến độ tất cả game của học sinh
export const getAllGameProgress = async (req, res) => {
  try {
    const { studentId } = req.params;

    const allProgress = await StudentGameProgress.findAll({
      where: { student_id: studentId },
      order: [['game_type', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: allProgress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy kết quả chơi game của học sinh
export const getStudentGameResults = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { gameType, limit = 20, offset = 0 } = req.query;

    const where = { student_id: studentId };
    if (gameType) where.game_type = gameType;

    const results = await GameResult.findAll({
      where,
      include: [
        {
          model: GameLevel,
          attributes: ['level_id', 'level_number', 'title', 'difficulty', 'time_limit']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const total = await GameResult.count({ where });

    res.status(200).json({
      success: true,
      data: results,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy thành tích của học sinh
export const getStudentAchievements = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { gameType } = req.query;

    const where = { student_id: studentId };
    if (gameType) where.game_type = gameType;

    const achievements = await GameAchievement.findAll({
      where,
      order: [['earned_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: achievements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Bảng xếp hạng game
export const getGameLeaderboard = async (req, res) => {
  try {
    const { gameType } = req.params;
    const { limit = 10 } = req.query;

    const leaderboard = await StudentGameProgress.findAll({
      where: { game_type: gameType },
      order: [
        ['highest_level_passed', 'DESC'],
        ['total_stars', 'DESC'],
        ['total_attempts', 'ASC']
      ],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Thống kê game tổng quát
export const getGameStatistics = async (req, res) => {
  try {
    const { studentId } = req.params;

    const stats = await StudentGameProgress.findAll({
      where: { student_id: studentId }
    });

    const totalResults = await GameResult.count({
      where: { student_id: studentId }
    });

    const totalAchievements = await GameAchievement.count({
      where: { student_id: studentId }
    });

    const totalStars = await StudentGameProgress.sum('total_stars', {
      where: { student_id: studentId }
    });

    res.status(200).json({
      success: true,
      data: {
        total_games: stats.length,
        total_results: totalResults,
        total_achievements: totalAchievements,
        total_stars: totalStars || 0,
        games: stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Tạo hoặc cập nhật game level (admin)
export const createOrUpdateGameLevel = async (req, res) => {
  try {
    const { levelId } = req.params;
    const { gameType, levelNumber, title, description, difficulty, timeLimit, requiredScore, config } = req.body;

    if (!gameType || !levelNumber || !title) {
      return res.status(400).json({
        message: 'Thiếu dữ liệu bắt buộc'
      });
    }

    let level;

    if (levelId) {
      level = await GameLevel.findByPk(levelId);
      if (!level) {
        return res.status(404).json({
          message: 'Không tìm thấy level này'
        });
      }

      await level.update({
        game_type: gameType,
        level_number: levelNumber,
        title,
        description,
        difficulty,
        time_limit: timeLimit,
        required_score: requiredScore,
        config
      });
    } else {
      level = await GameLevel.create({
        game_type: gameType,
        level_number: levelNumber,
        title,
        description,
        difficulty,
        time_limit: timeLimit,
        required_score: requiredScore,
        config
      });
    }

    res.status(levelId ? 200 : 201).json({
      success: true,
      message: levelId ? 'Cập nhật level thành công' : 'Tạo level thành công',
      data: level
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Xóa game level (admin)
export const deleteGameLevel = async (req, res) => {
  try {
    const { levelId } = req.params;

    const level = await GameLevel.findByPk(levelId);
    if (!level) {
      return res.status(404).json({
        message: 'Không tìm thấy level này'
      });
    }

    await level.destroy();

    res.status(200).json({
      success: true,
      message: 'Xóa level thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
