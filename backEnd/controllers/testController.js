import { Test, TestResult, Exercise } from '../models/index.js';

export const getTests = async (req, res) => {
  try {
    const tests = await Test.findAll({
      include: [
        { model: Exercise, as: 'exercises' }
      ]
    });

    res.json({
      success: true,
      data: tests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findByPk(id, {
      include: [
        { model: Exercise, as: 'exercises' }
      ]
    });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    res.json({
      success: true,
      data: test
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const createTest = async (req, res) => {
  try {
    const { title, lesson_id, duration, exercise_ids } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const test = await Test.create({
      title,
      lesson_id,
      duration,
      created_by: req.user?.user_id
    });

    res.status(201).json({
      success: true,
      message: 'Test created successfully',
      data: test
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const submitTestResult = async (req, res) => {
  try {
    const { test_id, student_id, score, total_questions, correct_count, time_spent } = req.body;

    if (!test_id || !student_id) {
      return res.status(400).json({
        success: false,
        message: 'test_id and student_id are required'
      });
    }

    const result = await TestResult.create({
      test_id,
      student_id,
      score: score || 0,
      total_questions,
      correct_count,
      time_spent
    });

    res.status(201).json({
      success: true,
      message: 'Test result submitted successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const getTestResults = async (req, res) => {
  try {
    const { student_id, test_id } = req.query;
    const where = {};

    if (student_id) where.student_id = student_id;
    if (test_id) where.test_id = test_id;

    const results = await TestResult.findAll({ 
      where,
      include: [{ model: Test, as: 'test' }]
    });

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const getStudentTestResults = async (req, res) => {
  try {
    const { student_id } = req.params;

    const results = await TestResult.findAll({
      where: { student_id },
      include: [{ model: Test, as: 'test' }],
      order: [['submitted_at', 'DESC']]
    });

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
