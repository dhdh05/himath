import { ProgressTracking, CompletedLevel, Reward, Student } from '../models/index.js';

export const getStudentProgress = async (req, res) => {
  try {
    const { student_id } = req.params;

    const progress = await ProgressTracking.findAll({
      where: { student_id },
      include: [{ model: Student, as: 'student' }]
    });

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const updateLessonProgress = async (req, res) => {
  try {
    const { student_id, lesson_id, status, total_time_spent } = req.body;

    if (!student_id || !lesson_id) {
      return res.status(400).json({
        success: false,
        message: 'student_id and lesson_id are required'
      });
    }

    const [progress, created] = await ProgressTracking.findOrCreate({
      where: { student_id, lesson_id },
      defaults: {
        status: status || 'in_progress',
        total_time_spent: total_time_spent || 0
      }
    });

    if (!created) {
      await progress.update({
        status: status || progress.status,
        total_time_spent: (progress.total_time_spent || 0) + (total_time_spent || 0),
        last_accessed: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const completeLesson = async (req, res) => {
  try {
    const { student_id, lesson_id } = req.params;

    const progress = await ProgressTracking.findOne({
      where: { student_id, lesson_id }
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress record not found'
      });
    }

    await progress.update({ status: 'completed' });

    res.json({
      success: true,
      message: 'Lesson marked as completed',
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const getCompletedLevels = async (req, res) => {
  try {
    const { user_id } = req.params;

    const levels = await CompletedLevel.findAll({
      where: { user_id }
    });

    res.json({
      success: true,
      data: levels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const completeLevel = async (req, res) => {
  try {
    const { user_id, level_id } = req.body;

    if (!user_id || !level_id) {
      return res.status(400).json({
        success: false,
        message: 'user_id and level_id are required'
      });
    }

    const [completed] = await CompletedLevel.findOrCreate({
      where: { user_id, level_id }
    });

    res.json({
      success: true,
      message: 'Level completed successfully',
      data: completed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const getStudentRewards = async (req, res) => {
  try {
    const { student_id } = req.params;

    const rewards = await Reward.findAll({
      where: { student_id }
    });

    res.json({
      success: true,
      data: rewards
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const awardReward = async (req, res) => {
  try {
    const { student_id, reward_title, image_url, reason } = req.body;

    if (!student_id || !reward_title) {
      return res.status(400).json({
        success: false,
        message: 'student_id and reward_title are required'
      });
    }

    const reward = await Reward.create({
      student_id,
      reward_title,
      image_url,
      reason
    });

    res.status(201).json({
      success: true,
      message: 'Reward awarded successfully',
      data: reward
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
