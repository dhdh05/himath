import { Exercise, Lesson } from '../models/index.js';

export const getExercises = async (req, res) => {
  try {
    const { lesson_id, level, type } = req.query;
    const where = {};

    if (lesson_id) where.lesson_id = lesson_id;
    if (level) where.level = level;
    if (type) where.type = type;

    const exercises = await Exercise.findAll({ where });

    res.json({
      success: true,
      data: exercises
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const getExerciseById = async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findByPk(id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    res.json({
      success: true,
      data: exercise
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const createExercise = async (req, res) => {
  try {
    const { lesson_id, question_text, audio_url, image_url, options, correct_answer, level, type } = req.body;

    if (!lesson_id || !question_text) {
      return res.status(400).json({
        success: false,
        message: 'lesson_id and question_text are required'
      });
    }

    // Check if lesson exists
    const lesson = await Lesson.findByPk(lesson_id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    const exercise = await Exercise.create({
      lesson_id,
      question_text,
      audio_url,
      image_url,
      options,
      correct_answer,
      level: level || 'easy',
      type: type || 'multiple_choice'
    });

    res.status(201).json({
      success: true,
      message: 'Exercise created successfully',
      data: exercise
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const { question_text, audio_url, image_url, options, correct_answer, level, type } = req.body;

    const exercise = await Exercise.findByPk(id);
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    await exercise.update({
      question_text: question_text || exercise.question_text,
      audio_url: audio_url || exercise.audio_url,
      image_url: image_url || exercise.image_url,
      options: options || exercise.options,
      correct_answer: correct_answer || exercise.correct_answer,
      level: level || exercise.level,
      type: type || exercise.type
    });

    res.json({
      success: true,
      message: 'Exercise updated successfully',
      data: exercise
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findByPk(id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    await exercise.destroy();

    res.json({
      success: true,
      message: 'Exercise deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
